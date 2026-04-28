'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS, getAllTiers } from '@/lib/subscription-access';
import { SubscriptionTier } from '@prisma/client';
import Heading from '@/shared/Heading';
import ButtonPrimary from '@/shared/ButtonPrimary';
import { SelectBusinessModal } from './SelectBusinessModal';

interface SectionSubscriptionPackagesProps {
  businessId?: string;
}

const SectionSubscriptionPackages: React.FC<SectionSubscriptionPackagesProps> = ({ businessId = '' }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null);
  const [userActiveTier, setUserActiveTier] = useState<SubscriptionTier | null>(null);
  const [userBusinessId, setUserBusinessId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [processingTier, setProcessingTier] = useState<string | null>(null);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<string | null>(null);
  const [shouldShowSection, setShouldShowSection] = useState(true);

  useEffect(() => {
    if (businessId) {
      fetchSubscriptionStatus();
    }
  }, [businessId]);

  // ðŸ” Check visibility based on user role and subscription status
  useEffect(() => {
    const checkVisibility = async () => {
      // Show section for anonymous users (no session)
      if (!session?.user) {
        setShouldShowSection(true);
        return;
      }

      // Hide section for USER role logged in users
      if (session.user.role === 'USER') {
        setShouldShowSection(false);
        return;
      }

      // For BUSINESS owners, check subscription status
      if (session.user.role === 'BUSINESS') {
        try {
          const response = await fetch('/api/user/businesses');
          const data = await response.json();

          if (data.businesses && Array.isArray(data.businesses) && data.businesses.length > 0) {
            const biz = data.businesses[0];
            const tier = biz.subscription?.plan?.tier as SubscriptionTier | undefined;
            setUserBusinessId(biz.id || '');

            if (tier && tier !== 'WILD_HORSES') {
              setUserActiveTier(tier);
              // Desert Lions = already on best plan, hide completely
              // Desert Elephants = show upgrade banner
              setShouldShowSection(tier !== 'DESERT_LIONS');
            } else {
              setUserActiveTier('WILD_HORSES');
              setShouldShowSection(true);
            }
          } else {
            setShouldShowSection(true);
          }
        } catch (error) {
          console.error('Error checking business subscription:', error);
          setShouldShowSection(true);
        }
      }
    };

    checkVisibility();
  }, [session]);

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
    }
  };

  const handleSubscribe = async (planTier: string) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (!businessId) {
      // Show business selector modal if no businessId provided
      setSelectedPlanTier(planTier);
      setShowBusinessSelector(true);
      return;
    }

    setProcessingTier(planTier);

    try {
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier,
          businessId,
          billingCycle: 'YEARLY',
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.free) {
          // Free plan
          router.push(`/business/${businessId}/subscription`);
        } else if (data.checkout?.params && data.checkout?.initiateUrl && data.checkout?.reference) {
          // Paid plan - Two-step PayGate flow per documentation
          try {
            const reference = data.checkout.reference;
            
            console.log('[Subscription] Step 1: Calling backend proxy for PayGate initiate');
            
            // Step 1: Call backend to handle PayGate initiate.trans and save PAY_REQUEST_ID
            // This ensures pay_request_id is saved to database BEFORE proceeding
            const initiateResponse = await fetch('/api/subscriptions/initiate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                params: data.checkout.params,
                reference,
              }),
            });

            const initiateData = await initiateResponse.json();
            console.log('[Subscription] Step 2: Backend initiate response:', initiateData);

            // CRITICAL: Check for success and valid payRequestId before proceeding
            if (!initiateData.success || !initiateData.payRequestId) {
              console.error('[Subscription] âŒ Initiate failed or no payRequestId returned');
              console.error('[Subscription] Response:', initiateData);
              alert(`Payment processing error: ${initiateData.message || 'Failed to initialize payment request'}\n\nPlease try again or contact support.`);
              return;
            }

            const payRequestId = initiateData.payRequestId;
            console.log('[Subscription] âœ… Step 2: Received verified PAY_REQUEST_ID:', payRequestId);

            // Step 2: Call our backend to calculate process.trans checksum
            console.log('[Subscription] Step 3: Getting process parameters');
            const processResponse = await fetch('/api/subscriptions/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                payRequestId,
                reference,
              }),
            });

            const processData = await processResponse.json();
            console.log('[Subscription] Step 4: Got process params from backend');

            if (processData.success && processData.params) {
              // Step 3: Submit to process.trans to show payment form
              console.log('[Subscription] Step 5: Submitting to process.trans');
              const processForm = document.createElement("form");
              processForm.method = "POST";
              processForm.action = processData.processUrl;

              Object.entries(processData.params).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = String(value);
                processForm.appendChild(input);
              });

              document.body.appendChild(processForm);
              processForm.submit();
            } else {
              console.error('Failed to get process params:', processData);
              alert('Error: Could not prepare payment redirect. Please try again.');
            }
          } catch (error) {
            console.error('[Subscription] Error in payment flow:', error);
            alert('Error processing payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
          } finally {
            setProcessingTier(null);
          }
        }
      } else {
        alert('Failed to initiate subscription: ' + data.message);
      }
    } catch (error) {
      console.error('Error processing subscription:', error);
      alert('Error processing subscription. Please try again.');
    } finally {
      setProcessingTier(null);
    }
  };

  const handleBusinessSelect = async (selectedBusinessId: string) => {
    if (selectedPlanTier) {
      setProcessingTier(selectedPlanTier);
      try {
        const response = await fetch('/api/subscriptions/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planTier: selectedPlanTier,
            businessId: selectedBusinessId,
            billingCycle: 'YEARLY',
          }),
        });

        const data = await response.json();

        if (data.success) {
          if (data.free) {
            // Free plan
            router.push(`/business/${selectedBusinessId}/subscription`);
          } else if (data.checkout?.params && data.checkout?.initiateUrl && data.checkout?.reference) {
            // Paid plan - Two-step PayGate flow per documentation
            try {
              const reference = data.checkout.reference;
              
              console.log('[Subscription] Step 1: Calling backend proxy for PayGate initiate');
              
              // Step 1: Call backend to handle PayGate initiate.trans and save PAY_REQUEST_ID
              // This ensures pay_request_id is saved to database BEFORE proceeding
              const initiateResponse = await fetch('/api/subscriptions/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  params: data.checkout.params,
                  reference,
                }),
              });

              const initiateData = await initiateResponse.json();
              console.log('[Subscription] Step 2: Backend initiate response:', initiateData);

              // CRITICAL: Check for success and valid payRequestId before proceeding
              if (!initiateData.success || !initiateData.payRequestId) {
                console.error('[Subscription] âŒ Initiate failed or no payRequestId returned');
                console.error('[Subscription] Response:', initiateData);
                alert(`Payment processing error: ${initiateData.message || 'Failed to initialize payment request'}\n\nPlease try again or contact support.`);
                return;
              }

              const payRequestId = initiateData.payRequestId;
              console.log('[Subscription] âœ… Step 2: Received verified PAY_REQUEST_ID:', payRequestId);

              // Step 2: Call our backend to calculate process.trans checksum
              console.log('[Subscription] Step 3: Getting process parameters');
              const processResponse = await fetch('/api/subscriptions/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  payRequestId,
                  reference,
                }),
              });

              const processData = await processResponse.json();
              console.log('[Subscription] Step 4: Got process params from backend');

              if (processData.success && processData.params) {
                // Step 3: Submit to process.trans to show payment form
                console.log('[Subscription] Step 5: Submitting to process.trans');
                const processForm = document.createElement("form");
                processForm.method = "POST";
                processForm.action = processData.processUrl;

                Object.entries(processData.params).forEach(([key, value]) => {
                  const input = document.createElement("input");
                  input.type = "hidden";
                  input.name = key;
                  input.value = String(value);
                  processForm.appendChild(input);
                });

                document.body.appendChild(processForm);
                processForm.submit();
              } else {
                console.error('Failed to get process params:', processData);
                alert('Error: Could not prepare payment redirect. Please try again.');
              }
            } catch (error) {
              console.error('[Subscription] Error in payment flow:', error);
              alert('Error processing payment: ' + (error instanceof Error ? error.message : 'Unknown error'));
            } finally {
              setProcessingTier(null);
            }
          }
        } else {
          alert('Failed to initiate subscription: ' + data.message);
        }
      } catch (error) {
        console.error('Error processing subscription:', error);
        alert('Error processing subscription. Please try again.');
      } finally {
        setProcessingTier(null);
      }
    }
  };

  const handleCreateNewBusiness = () => {
    setShowBusinessSelector(false);
    router.push('/business/create?fromSubscription=true&planTier=' + selectedPlanTier);
  };

  const tiers = getAllTiers();

  const featureMatrix = [
    { label: 'Basic business profile', WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Logo upload', WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Appears in search results', WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Receive bookings & reviews', WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: `Photos (${SUBSCRIPTION_TIERS.WILD_HORSES.limits.photos} / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.photos} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.photos})`, WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Cover image', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Social media links', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Business hours (public profile)', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Location map (public profile)', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Services offered (public profile)', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Memberships & Associations', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: `Product/service listings (${SUBSCRIPTION_TIERS.WILD_HORSES.limits.listings} / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.listings} / âˆž)`, WILD_HORSES: true, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: `Promotions/month (0 / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.promotions} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.promotions})`, WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: `Branch locations (0 / ${SUBSCRIPTION_TIERS.DESERT_ELEPHANTS.limits.branches} / ${SUBSCRIPTION_TIERS.DESERT_LIONS.limits.branches})`, WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Property listings', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Membership management', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Enhanced profile & higher ranking', WILD_HORSES: false, DESERT_ELEPHANTS: true, DESERT_LIONS: true },
    { label: 'Video introduction', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
    { label: 'Featured business badge', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
    { label: 'Top search placement', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
    { label: 'WhatsApp chatbot integration', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
    { label: 'Full analytics dashboard', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
    { label: 'Dedicated account manager', WILD_HORSES: false, DESERT_ELEPHANTS: false, DESERT_LIONS: true },
  ];

  // Desert Lions = already on top plan, hide completely
  if (!shouldShowSection && userActiveTier === 'DESERT_LIONS') {
    return null;
  }

  // Desert Elephants = show compact upgrade banner to Desert Lions
  if (!shouldShowSection && userActiveTier === 'DESERT_ELEPHANTS') {
    const lionsInfo = SUBSCRIPTION_TIERS.DESERT_LIONS;
    const lionsExclusiveFeatures = [
      'Video introduction',
      'Featured business badge',
      'Top search placement',
      'WhatsApp chatbot integration',
      'Full analytics dashboard',
      'Dedicated account manager',
    ];
    return (
      <div className="relative pt-4">
        <Heading isCenter desc="You're on Desert Elephants. Unlock the full power of Botswana Services.">
          Ready to go further? ðŸ¦
        </Heading>
        <div className="mt-10 max-w-2xl mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">ðŸ¦</span>
            <div>
              <h3 className="text-2xl font-bold">Upgrade to Desert Lions</h3>
              <p className="text-orange-100 text-sm">Unlock all premium features</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold">BWP {lionsInfo.yearlyPrice.toFixed(2)}</p>
              <p className="text-orange-100 text-sm">/year</p>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lionsExclusiveFeatures.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-orange-50">
                <span className="text-yellow-300">âœ“</span> {f}
              </div>
            ))}
          </div>
          <button
            onClick={() => handleSubscribe('DESERT_LIONS')}
            disabled={processingTier === 'DESERT_LIONS'}
            className="w-full py-3 rounded-xl bg-white text-orange-600 font-bold text-lg hover:bg-orange-50 transition-colors disabled:opacity-60"
          >
            {processingTier === 'DESERT_LIONS' ? 'Processing...' : 'Upgrade to Desert Lions â†’'}
          </button>
        </div>
        <SelectBusinessModal
          isOpen={showBusinessSelector}
          onClose={() => setShowBusinessSelector(false)}
          onSelect={handleBusinessSelect}
          onCreateNew={handleCreateNewBusiness}
          planTier={selectedPlanTier || 'DESERT_LIONS'}
        />
      </div>
    );
  }

  return (
    <div className="relative pt-4">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Heading isCenter desc="Choose the perfect plan for your business and unlock powerful features">
          Botswana Services Packages
        </Heading>
      </div>

      {/* Annual billing notice */}
      <div className="mt-10 flex justify-center">
        <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm font-semibold px-4 py-2 rounded-full">
          Annual billing â€” pay once, covered for the whole year
        </span>
      </div>

      {/* Packages Grid */}
      <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {tiers.map((tier, idx) => {
          const isPremium = tier.tier === 'DESERT_LIONS';
          const isStandard = tier.tier === 'DESERT_ELEPHANTS';
          const isFree = tier.tier === 'WILD_HORSES';

          return (
            <div
              key={tier.tier}
              className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                isPremium
                  ? 'nc-shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white md:scale-105 md:-mt-6'
                  : isStandard
                  ? 'nc-shadow-lg bg-white dark:bg-slate-900 border-2 border-burgundy-200 dark:border-burgundy-700'
                  : 'nc-shadow-lg bg-white dark:bg-slate-900'
              } ${currentTier === tier.tier ? 'ring-2 ring-burgundy-600' : ''}`}
            >
              {/* Best Value Badge */}
              {isPremium && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-300 to-yellow-400 text-orange-900 px-4 py-2 rounded-bl-lg font-semibold text-xs uppercase tracking-wider">
                  ðŸ† Best Value
                </div>
              )}

              {/* Current Plan Badge */}
              {currentTier === tier.tier && (
                <div className="absolute top-0 left-0 bg-burgundy-600 text-white px-4 py-2 rounded-br-lg font-semibold text-xs uppercase">
                  âœ“ Active Plan
                </div>
              )}

              <div className="p-6 sm:p-8 flex flex-col flex-grow">
                {/* Icon/Emoji */}
                <div className="mb-4 text-4xl">
                  {tier.tier === 'WILD_HORSES' && 'ðŸ´'}
                  {tier.tier === 'DESERT_ELEPHANTS' && 'ðŸ˜'}
                  {tier.tier === 'DESERT_LIONS' && 'ðŸ¦'}
                </div>

                {/* Tier Name */}
                <h3
                  className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm mb-6 ${
                    isPremium
                      ? 'text-orange-100'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-5xl font-bold ${
                        isPremium ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {tier.yearlyPrice === 0 ? 'FREE' : `BWP ${tier.yearlyPrice.toFixed(2)}`}
                    </span>
                    {tier.yearlyPrice > 0 && (
                      <span className={isPremium ? 'text-orange-100' : 'text-gray-600 dark:text-gray-400'}>
                        /year
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  {currentTier === tier.tier && businessId ? (
                    <button
                      disabled
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        isPremium
                          ? 'bg-white text-orange-600 cursor-default opacity-80'
                          : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-default'
                      }`}
                    >
                      âœ“ Your Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(tier.tier)}
                      disabled={processingTier === tier.tier}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        isPremium
                          ? 'bg-white text-orange-600 hover:bg-orange-50 disabled:bg-gray-300 disabled:text-gray-600'
                          : 'bg-burgundy-600 hover:bg-burgundy-700 text-white disabled:bg-gray-400'
                      }`}
                    >
                      {processingTier === tier.tier ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                              opacity="0.25"
                            />
                            <path
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `${tier.yearlyPrice === 0 ? 'Get Started' : 'Subscribe Now'} â†’`
                      )}
                    </button>
                  )}
                </div>

                {/* Full Feature List */}
                <div className="flex-grow">
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isPremium ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    What&apos;s included
                  </p>
                  <ul className="space-y-2">
                    {featureMatrix.map((f, i) => {
                      const included = (f as any)[tier.tier];
                      return (
                        <li key={i} className="flex items-start gap-2">
                          {included ? (
                            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPremium ? 'bg-white bg-opacity-20' : 'bg-green-100 dark:bg-green-900/40'}`}>
                              <svg className={`w-2.5 h-2.5 ${isPremium ? 'text-yellow-300' : 'text-green-600 dark:text-green-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : (
                            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPremium ? 'bg-white bg-opacity-10' : 'bg-red-50 dark:bg-red-900/20'}`}>
                              <svg className={`w-2.5 h-2.5 ${isPremium ? 'text-orange-200' : 'text-red-400 dark:text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          <span className={`text-xs ${included ? (isPremium ? 'text-orange-50' : 'text-gray-700 dark:text-gray-300') : (isPremium ? 'text-orange-200 line-through' : 'text-gray-400 dark:text-gray-500 line-through')}`}>
                            {f.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          ðŸš€ All plans include free business listing. Upgrade anytime to unlock premium features.
        </p>
      </div>

      {/* Business Selection Modal */}
      <SelectBusinessModal
        isOpen={showBusinessSelector}
        onClose={() => setShowBusinessSelector(false)}
        onSelect={handleBusinessSelect}
        onCreateNew={handleCreateNewBusiness}
        planTier={selectedPlanTier || 'WILD_HORSES'}
      />
    </div>
  );
};

export default SectionSubscriptionPackages;
