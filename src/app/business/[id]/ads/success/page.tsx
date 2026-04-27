'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { CheckCircle, Clock, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

type PageStatus = 'loading' | 'success' | 'failed' | 'pending' | 'error';

interface PaymentStatusData {
  status: 'success' | 'failed' | 'pending';
  paymentStatus: string;
  subscriptionStatus: string;
  subscriptionId?: string;
  packageId?: string;
  adTitle?: string;
  expiryDate?: string;
  businessId?: string;
  failureReason?: string;
}

export default function AdPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const businessId = params?.id as string;

  const [status, setStatus] = useState<PageStatus>('loading');
  const [data, setData] = useState<PaymentStatusData | null>(null);
  const [reference, setReference] = useState('');
  const [attempts, setAttempts] = useState(0);

  const checkStatus = useCallback(async (ref: string, attempt: number) => {
    try {
      const res = await fetch(`/api/advertising/status?reference=${encodeURIComponent(ref)}`);

      if (!res.ok) {
        // Payment record not found yet — callback may still be in flight
        if (attempt < 5) {
          setTimeout(() => checkStatus(ref, attempt + 1), 2000);
          setAttempts(attempt + 1);
        } else {
          setStatus('pending');
        }
        return;
      }

      const result = await res.json();
      setData(result);

      if (result.status === 'success') {
        setStatus('success');
      } else if (result.status === 'failed') {
        setStatus('failed');
      } else {
        // Still pending — callback hasn't arrived yet, retry up to 5 times
        if (attempt < 5) {
          setTimeout(() => checkStatus(ref, attempt + 1), 2000);
          setAttempts(attempt + 1);
        } else {
          setStatus('pending');
        }
      }
    } catch {
      if (attempt < 5) {
        setTimeout(() => checkStatus(ref, attempt + 1), 2000);
      } else {
        setStatus('pending');
      }
    }
  }, []);

  useEffect(() => {
    const ref = searchParams.get('reference') || '';
    if (!ref) {
      setStatus('error');
      return;
    }
    setReference(ref);
    // Give the PayGate callback ~3s head start — callback and return fire simultaneously
    setTimeout(() => checkStatus(ref, 0), 3000);
  }, [searchParams, checkStatus]);

  const dashboardHref = `/business`;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {attempts > 0 ? `Confirming payment… (${attempts}/5)` : 'Processing your payment…'}
          </p>
        </div>
      </div>
    );
  }

  // ── Error (no reference) ──────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Request</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Missing payment reference. Please try again from the advertising page.
          </p>
          <Link href={dashboardHref} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Payment failed ────────────────────────────────────────────────────────
  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h1>
            <p className="text-gray-600 dark:text-gray-400">Your payment could not be processed.</p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6 space-y-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">REFERENCE</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{reference}</p>
            </div>
            {data?.failureReason && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">REASON</p>
                <p className="text-sm text-red-700 dark:text-red-300">{data.failureReason}</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            Your subscription has not been activated. No charge was made.
          </p>

          <div className="space-y-3">
            <Link
              href={`/business/${businessId}/ads`}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Try Again
            </Link>
            <Link
              href={dashboardHref}
              className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending / still processing ────────────────────────────────────────────
  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Processing</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your payment is being verified. This can take a few minutes.
            </p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">REFERENCE</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{reference}</p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
            You'll receive an email once confirmed. Check your dashboard for the latest status.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => { setStatus('loading'); setAttempts(0); checkStatus(reference, 0); }}
              className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Check Again
            </button>
            <Link
              href={dashboardHref}
              className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400">Your advertising campaign is now active</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 space-y-3">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">TRANSACTION REFERENCE</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">{reference}</p>
          </div>
          {data?.subscriptionId && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">AD ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{data.subscriptionId}</p>
            </div>
          )}
          {data?.adTitle && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">AD TITLE</p>
              <p className="text-sm text-gray-900 dark:text-white">{data.adTitle}</p>
            </div>
          )}
          {data?.expiryDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">ACTIVE UNTIL</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {new Date(data.expiryDate).toLocaleDateString('en-NA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-3">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>✓ Your ad is live!</strong> It will start appearing across our platform immediately.
            </p>
          </div>
          <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-3">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>✓ Track performance</strong> — monitor impressions and clicks from your dashboard.
            </p>
          </div>
          <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-3">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>✓ Confirmation sent</strong> — check your email for the payment receipt.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">What&apos;s Next?</h3>
          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-2"><span className="font-bold text-blue-600 flex-shrink-0">1.</span><span>Your ad is live and visible to users</span></li>
            <li className="flex gap-2"><span className="font-bold text-blue-600 flex-shrink-0">2.</span><span>Monitor performance in your dashboard</span></li>
            <li className="flex gap-2"><span className="font-bold text-blue-600 flex-shrink-0">3.</span><span>Renew or upgrade your plan as needed</span></li>
          </ol>
        </div>

        <div className="space-y-3">
          <Link
            href={dashboardHref}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>Need help? Contact our <Link href="/contact" className="text-blue-600 hover:underline">support team</Link></p>
        </div>
      </div>
    </div>
  );
}
