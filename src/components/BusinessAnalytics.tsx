'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { EyeIcon, StarIcon, ChatBubbleLeftIcon, CameraIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface BusinessAnalyticsProps {
  businessId: string;
}

const StatCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
    <p className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
  </div>
);

const BusinessAnalytics: React.FC<BusinessAnalyticsProps> = ({ businessId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/business/analytics?businessId=${businessId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.analytics);
        else setError(d.message || 'Failed to load analytics');
      })
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
        <p>{error || 'No analytics data available'}</p>
      </div>
    );
  }

  const { overview, subscription, recentReviews, ratingDistribution, paymentsByMonth, reviewsByMonth } = data;
  const maxRatingCount = Math.max(...ratingDistribution.map((r: any) => r.count), 1);

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard icon={EyeIcon} label="Total Profile Views" value={overview.totalViews.toLocaleString()} color="bg-blue-500" />
          <StatCard icon={StarIcon} label="Average Rating" value={overview.averageRating || 'â€”'} sub={`from ${overview.totalReviews} reviews`} color="bg-amber-500" />
          <StatCard icon={ChatBubbleLeftIcon} label="Total Reviews" value={overview.totalReviews} color="bg-green-500" />
          <StatCard icon={CameraIcon} label="Photos" value={overview.totalPhotos} color="bg-purple-500" />
          <StatCard icon={DocumentTextIcon} label="Listings" value={overview.totalListings} color="bg-indigo-500" />
          <StatCard icon={CalendarIcon} label="Total Bookings" value={overview.totalBookings} sub={`${overview.confirmedBookings} confirmed`} color="bg-rose-500" />
        </div>
      </div>

      {/* Subscription Summary */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Subscription</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Current Plan</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{subscription.planName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Status</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
              subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
              subscription.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {subscription.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Paid</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {subscription.totalPaid > 0 ? `BWP ${subscription.totalPaid.toLocaleString()}` : 'â€”'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Payments Made</p>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{subscription.paymentsCount}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Reviews Trend */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Reviews (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={reviewsByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Reviews" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment History */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Payments (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={paymentsByMonth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `BWP ${v}`} />
              <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Amount (BWP )" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {ratingDistribution.map((r: any) => (
            <div key={r.star} className="flex items-center gap-3">
              <span className="text-sm font-medium w-12 text-neutral-700 dark:text-neutral-300">{r.star} â˜…</span>
              <div className="flex-1 bg-neutral-100 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${(r.count / maxRatingCount) * 100}%` }}
                />
              </div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400 w-6 text-right">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {recentReviews.map((review: any, i: number) => (
              <div key={i} className="flex gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                <div className="flex-shrink-0 w-10 h-10 bg-neutral-200 dark:bg-neutral-600 rounded-full flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-200">
                  {(review.reviewerName || 'A')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">{review.reviewerName}</span>
                    <span className="text-amber-400 text-sm">{'â˜…'.repeat(review.rating)}</span>
                    <span className="text-xs text-neutral-400 ml-auto">
                      {new Date(review.date).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">{review.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAnalytics;
