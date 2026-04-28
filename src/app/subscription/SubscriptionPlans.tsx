'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS, getAllTiers } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';

interface SubscriptionPlansProps {
  businessId: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ businessId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingTier, setProcessingTier] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [businessId]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `/api/subscriptions/status?businessId=${businessId}`
      );
      const data = await response.json();
      if (data.success) {
        setCurrentTier(data.subscription.tier);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planTier: string) => {
    const selectedCycle = 'YEARLY';
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setProcessingTier(planTier);

    try {
      // ========== STEP 1: Get checkout params ==========
      console.log('[Payment Flow] Step 1: Getting checkout params...');
      
      const checkoutResponse = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier,
          businessId,
          billingCycle: selectedCycle,
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutData.success) {
        alert('Failed: ' + checkoutData.message);
        setProcessingTier(null);
        return;
      }

      // Free plan - handle separately
      if (checkoutData.free) {
        router.push(checkoutData.redirectUrl);
        return;
      }

      const { initiateUrl, processUrl, params, reference } = checkoutData.checkout;

      console.log('[Payment Flow] Step 1 Complete: Received params and URLs');
      console.log('[Payment Flow] Reference:', reference);

      // ========== STEP 2 & 3: Submit to initiate.trans via server proxy ==========
      // The server-side proxy handles PayGate communication and saves PAY_REQUEST_ID
      console.log('[Payment Flow] Step 2 & 3: Submitting to server proxy...');

      let payRequestId: string | null = null;
      
      try {
        const initiateResponse = await fetch('/api/subscriptions/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            params,
            reference,
          }),
        });

        const initiateData = await initiateResponse.json();
        
        if (!initiateData.success) {
          console.error('[Payment Flow] Initiate failed:', initiateData.message);
          alert('Payment error: ' + initiateData.message);
          setProcessingTier(null);
          return;
        }

        payRequestId = initiateData.payRequestId;
        
        if (!payRequestId) {
          console.error('[Payment Flow] No PAY_REQUEST_ID in response');
          alert('Payment error: Failed to get payment request ID');
          setProcessingTier(null);
          return;
        }

        console.log('[Payment Flow] Step 2 & 3 Complete: PAY_REQUEST_ID extracted and saved:', payRequestId);
      } catch (error) {
        console.error('[Payment Flow] Server proxy error:', error);
        alert('Payment error: ' + (error instanceof Error ? error.message : 'Server error'));
        setProcessingTier(null);
        return;
      }

      // ========== STEP 4: Get process.trans params ==========
      console.log('[Payment Flow] Step 4: Getting process.trans parameters...');

      const processResponse = await fetch('/api/subscriptions/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payRequestId,
          reference,
        }),
      });

      const processData = await processResponse.json();

      if (!processData.success) {
        console.error('[Payment Flow] Process endpoint error:', processData.message);
        alert('Payment error: Failed to process payment request');
        setProcessingTier(null);
        return;
      }

      console.log('[Payment Flow] Step 4 Complete: Received process params');
      console.log('[Payment Flow] Process URL:', processData.processUrl);

      // ========== STEP 5: Submit to process.trans ==========
      console.log('[Payment Flow] Step 5: Submitting to process.trans...');

      const processForm = document.createElement('form');
      processForm.method = 'POST';
      processForm.action = processData.processUrl;

      // Add process parameters to form
      Object.entries(processData.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        processForm.appendChild(input);
        console.log(`[Payment Flow] Added field: ${key}`);
      });

      document.body.appendChild(processForm);

      console.log('[Payment Flow] Step 5: Submitting form to process.trans...');
      console.log('[Payment Flow] Form HTML:', processForm.outerHTML);

      // Submit the form to PayGate's process.trans
      // User will be redirected to PayGate hosted payment page
      setTimeout(() => {
        processForm.submit();
      }, 100);

    } catch (error) {
      console.error('[Payment Flow] Unexpected error:', error);
      alert('Payment error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setProcessingTier(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const tiers = getAllTiers();

  // Full feature matrix â€” each entry defines per-tier availability
  const featureMatrix = [
    {
      label: 'Basic business profile',
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Logo upload',
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Receive bookings & reviews',
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Appears in search results',
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: `Photos (${SUBSCRIPTION_TIERS.WILD_HORSES.limits.photos} / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.photos} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.photos})`,
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Cover image',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Social media links',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Business Hours (public profile)',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Location map (public profile)',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Services Offered (public profile)',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Memberships & Associations',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: `Product/service listings (${SUBSCRIPTION_TIERS.WILD_HORSES.limits.listings} / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.listings} / âˆž)`,
      WILD_HORSES: true,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: `Promotions/month (0 / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.promotions} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.promotions})`,
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: `Branch locations (0 / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.branches} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.branches})`,
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Property listings',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Membership management',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Enhanced profile & higher ranking',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: true,
      DESERT_LIONS: true,
    },
    {
      label: 'Video introduction',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
    {
      label: 'Featured business badge',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
    {
      label: 'Top search placement',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
    {
      label: 'WhatsApp chatbot integration',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
    {
      label: 'Full analytics dashboard',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
    {
      label: 'Dedicated account manager',
      WILD_HORSES: false,
      DESERT_ELEPHANTS: false,
      DESERT_LIONS: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Botswana Services Packages
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the perfect plan to grow your business
          </p>
        </div>

        {/* Annual billing notice */}
        <div className="flex items-center justify-center mb-10">
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold px-4 py-2 rounded-full">
            Annual billing â€” pay once, covered for the whole year
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const tierKey = tier.tier as keyof typeof featureMatrix[0];
            const included = featureMatrix.filter((f) => f[tierKey] === true);
            const notIncluded = featureMatrix.filter((f) => f[tierKey] === false);

            return (
            <div
              key={tier.tier}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900 overflow-hidden transition-transform duration-300 hover:shadow-2xl dark:hover:shadow-lg flex flex-col ${
                tier.tier === currentTier ? 'ring-2 ring-blue-600 dark:ring-blue-500' : ''
              } ${tier.yearlyPrice === 0 ? 'md:scale-95' : 'md:scale-100'}`}
            >
              {/* Current Plan Badge */}
              {tier.tier === currentTier && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-bl-lg font-semibold text-sm">
                  Current Plan
                </div>
              )}

              {/* Best Value Badge */}
              {tier.tier === 'DESERT_LIONS' && (
                <div className="absolute top-0 left-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-br-lg font-semibold text-sm">
                  Best Value
                </div>
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {tier.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  {tier.yearlyPrice === 0 ? (
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">FREE</span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">BWP {tier.yearlyPrice.toFixed(2)}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/year</span>
                    </div>
                  )}
                </div>

                {/* Limits Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Photos</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{tier.limits.photos}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Listings</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{tier.limits.listings >= 999 ? 'âˆž' : tier.limits.listings}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Promos/mo</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{tier.limits.promotions}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-2 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Branches</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">{tier.limits.branches}</p>
                  </div>
                </div>

                {/* CTA Button */}
                {tier.tier === currentTier ? (
                  <button disabled className="w-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 py-3 rounded-lg font-semibold cursor-default mb-6">
                    Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(tier.tier)}
                    disabled={processingTier === tier.tier}
                    className={`w-full py-3 rounded-lg font-semibold mb-6 text-white transition-colors ${
                      processingTier === tier.tier
                        ? 'bg-gray-400 dark:bg-slate-600 cursor-not-allowed'
                        : tier.yearlyPrice === 0
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                  >
                    {processingTier === tier.tier ? 'Processing...' : tier.yearlyPrice === 0 ? 'Get Started Free' : 'Subscribe'}
                  </button>
                )}

                {/* Included Features */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Included:</h3>
                  <ul className="space-y-2 mb-5">
                    {included.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Not Included Features */}
                  {notIncluded.length > 0 && (
                    <>
                      <h3 className="font-semibold text-gray-400 dark:text-gray-500 text-sm mb-3">Not included:</h3>
                      <ul className="space-y-2">
                        {notIncluded.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-red-400 dark:text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{f.label}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="max-w-3xl mx-auto mt-16 bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-slate-900 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Subscription Details
          </h3>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Annual billing:</strong> Your subscription covers a full year.
                It will automatically renew annually. You can cancel anytime before renewal.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Secure payments:</strong> All payments are processed securely
                through PayGate.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Instant activation:</strong> Activate features immediately
                after payment.
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Support:</strong> Premium plans include dedicated support
                from our team.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
