'use client';

import React, { useState, useEffect } from 'react';
import Badge from '@/shared/Badge';

interface Booking {
  id: string;
  serviceType: string;
  date: string;
  time: string;
  duration?: number;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

const STATUS_COLORS: Record<string, 'green' | 'red' | 'yellow' | 'blue' | 'gray'> = {
  PENDING: 'yellow',
  CONFIRMED: 'blue',
  COMPLETED: 'green',
  CANCELLED: 'red',
  NO_SHOW: 'red',
};

const NEXT_STATUSES: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'NO_SHOW', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

const BookingsTab: React.FC<{ businessId: string }> = ({ businessId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    fetch('/api/business/bookings')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBookings(d.bookings); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [businessId]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setUpdating(bookingId);
    try {
      const res = await fetch(`/api/business/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: data.booking.status } : b))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Bookings</h2>
        <span className="text-sm text-neutral-500">{bookings.length} total</span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pending', key: 'PENDING', color: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Confirmed', key: 'CONFIRMED', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          { label: 'Completed', key: 'COMPLETED', color: 'bg-green-50 border-green-200 text-green-700' },
          { label: 'Cancelled', key: 'CANCELLED', color: 'bg-red-50 border-red-200 text-red-700' },
        ].map(({ label, key, color }) => (
          <div key={key} className={`rounded-xl p-4 border ${color} text-center`}>
            <p className="text-2xl font-bold">{counts[key] || 0}</p>
            <p className="text-xs font-medium mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === s
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-primary-400'
            }`}
          >
            {s}{s !== 'ALL' && counts[s] ? ` (${counts[s]})` : s === 'ALL' ? ` (${bookings.length})` : ''}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-400 text-lg mb-2">No bookings yet</p>
          <p className="text-neutral-400 text-sm">Bookings from customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {booking.customerName}
                    </span>
                    <Badge name={booking.status} color={STATUS_COLORS[booking.status] || 'gray'} />
                  </div>
                  <p className="text-sm font-medium text-primary-600">{booking.serviceType}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>📅 {new Date(booking.date).toLocaleDateString('en-NA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>🕐 {booking.time}</span>
                    {booking.duration && <span>⏱ {booking.duration} min</span>}
                    <span>📧 {booking.customerEmail}</span>
                    <span>📞 {booking.customerPhone}</span>
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic mt-1">"{booking.notes}"</p>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    Booked {new Date(booking.createdAt).toLocaleDateString('en-NA', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {NEXT_STATUSES[booking.status]?.length > 0 && (
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {NEXT_STATUSES[booking.status].map((next) => (
                      <button
                        key={next}
                        disabled={updating === booking.id}
                        onClick={() => updateStatus(booking.id, next)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-50 ${
                          next === 'CANCELLED' || next === 'NO_SHOW'
                            ? 'border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : next === 'CONFIRMED'
                            ? 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                            : 'border-green-300 text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {updating === booking.id ? '...' : next}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
