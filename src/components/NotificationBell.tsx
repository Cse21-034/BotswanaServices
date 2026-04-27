'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';

interface Notification {
  id: string;
  type: 'REVIEW' | 'BOOKING' | 'SYSTEM' | 'PROMOTIONAL';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

const TYPE_ICON: Record<string, string> = {
  REVIEW: '⭐',
  BOOKING: '📅',
  SYSTEM: '🔔',
  PROMOTIONAL: '🎁',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnread(data.unreadCount);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  const markOneRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((prev) => Math.max(0, prev - 1));
  };

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open && unread > 0) {
      // Mark all read when opening
      setTimeout(markAllRead, 2000);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        {unread > 0 ? (
          <BellAlertIcon className="w-6 h-6 text-primary-600" />
        ) : (
          <BellIcon className="w-6 h-6 text-neutral-600 dark:text-neutral-300" />
        )}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <BellIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markOneRead(n.id)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors border-b border-neutral-50 dark:border-neutral-700 last:border-0 ${
                    !n.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICON[n.type] || '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-tight ${!n.read ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-700">
              <p className="text-xs text-neutral-400 text-center">Last 50 notifications</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
