'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircleIcon, XCircleIcon, ClockIcon, BuildingStorefrontIcon,
  UserGroupIcon, StarIcon, EyeIcon, MagnifyingGlassIcon, EnvelopeIcon,
} from '@heroicons/react/24/outline';

type BusinessStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'SUSPENDED';

interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  status: BusinessStatus;
  verified: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  owner: { name: string; email: string };
  category: { name: string };
  reviews: any[];
}

interface Stats {
  total: number;
  published: number;
  pending: number;
  suspended: number;
  verified: number;
  totalViews: number;
}

const STATUS_COLORS: Record<BusinessStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  SUSPENDED: 'bg-red-100 text-red-700',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('PENDING');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState<'businesses' | 'enquiries'>('businesses');
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchDashboard();
      fetchBusinesses();
      fetchMessages();
    }
  }, [status, filter, search]);

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (e) {
      console.error('Messages fetch failed', e);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || data);
      }
    } catch (e) {
      console.error('Dashboard fetch failed', e);
    }
  };

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter && filter !== 'ALL') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/businesses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
      }
    } catch (e) {
      console.error('Businesses fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: BusinessStatus, rejectionReason = '') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      });
      if (res.ok) {
        setBusinesses((prev) => prev.filter((b) => b.id !== id));
        fetchDashboard();
      }
    } catch (e) {
      console.error('Status update failed', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = () => {
    if (!rejectModal) return;
    updateStatus(rejectModal.id, 'DRAFT', rejectReason);
    setRejectModal(null);
    setRejectReason('');
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BuildingStorefrontIcon className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:underline">← Back to site</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total', value: stats.total, icon: BuildingStorefrontIcon, color: 'text-blue-600' },
              { label: 'Published', value: stats.published, icon: CheckCircleIcon, color: 'text-green-600' },
              { label: 'Pending', value: stats.pending, icon: ClockIcon, color: 'text-yellow-600' },
              { label: 'Suspended', value: stats.suspended, icon: XCircleIcon, color: 'text-red-600' },
              { label: 'Verified', value: stats.verified, icon: UserGroupIcon, color: 'text-purple-600' },
              { label: 'Total Views', value: stats.totalViews?.toLocaleString() || 0, icon: EyeIcon, color: 'text-indigo-600' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-sm text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'businesses'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <BuildingStorefrontIcon className="inline w-4 h-4 mr-1.5 -mt-0.5" />
            Businesses
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <EnvelopeIcon className="inline w-4 h-4 -mt-0.5" />
            Enquiries
            {messages.length > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{messages.length}</span>
            )}
          </button>
        </div>

        {/* Enquiries Panel */}
        {activeTab === 'enquiries' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {messagesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <EnvelopeIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No enquiries yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-700">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {msg.firstName} {msg.lastName}
                          </p>
                          {msg.businessName && (
                            <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                              {msg.businessName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{msg.email}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {expandedMessage === msg.id ? msg.message : msg.message.substring(0, 120) + (msg.message.length > 120 ? '...' : '')}
                        </p>
                        {msg.message.length > 120 && (
                          <button
                            onClick={() => setExpandedMessage(expandedMessage === msg.id ? null : msg.id)}
                            className="text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline"
                          >
                            {expandedMessage === msg.id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <a
                          href={`mailto:${msg.email}`}
                          className="mt-2 inline-block text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          Reply
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Businesses Tab Content */}
        {activeTab === 'businesses' && <>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'PUBLISHED', 'SUSPENDED', 'DRAFT'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Business List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <BuildingStorefrontIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No businesses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Business</th>
                    <th className="px-6 py-3 text-left">Owner</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Views</th>
                    <th className="px-6 py-3 text-left">Reviews</th>
                    <th className="px-6 py-3 text-left">Registered</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{b.name}</p>
                          <p className="text-gray-400 text-xs">{b.city}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300">{b.owner?.name}</p>
                        <p className="text-gray-400 text-xs">{b.owner?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{b.category?.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                          {b.status}
                        </span>
                        {b.verified && <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Verified</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{b.viewCount}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <StarIcon className="w-3.5 h-3.5 text-amber-400" />
                          {b.reviews?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(b.createdAt).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {b.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => updateStatus(b.id, 'PUBLISHED')}
                              disabled={actionLoading === b.id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === b.id ? '…' : 'Approve'}
                            </button>
                          )}
                          {b.status !== 'SUSPENDED' && (
                            <button
                              onClick={() => updateStatus(b.id, 'SUSPENDED')}
                              disabled={actionLoading === b.id}
                              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                              Suspend
                            </button>
                          )}
                          {b.status === 'PENDING' && (
                            <button
                              onClick={() => setRejectModal({ id: b.id, name: b.name })}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          )}
                          <Link
                            href={`/listing-stay-detail/${b.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs font-semibold rounded-lg transition-colors"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>}
      </div>

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Reject "{rejectModal.name}"?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Provide a reason so the business owner knows what to fix.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Missing business description, invalid contact details..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
              >
                Reject & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
