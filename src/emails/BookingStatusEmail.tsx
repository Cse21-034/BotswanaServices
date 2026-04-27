import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';

interface BookingStatusEmailProps {
  customerName: string;
  businessName: string;
  serviceType: string;
  date: string;
  time: string;
  status: BookingStatus;
  businessSlug: string;
  notes?: string;
}

const STATUS_CONFIG: Record<BookingStatus, { emoji: string; color: string; bg: string; border: string; title: string; body: string }> = {
  CONFIRMED: {
    emoji: '✅',
    color: '#166534',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Booking Confirmed!',
    body: 'Great news! Your booking has been confirmed by the business. See you soon!',
  },
  CANCELLED: {
    emoji: '❌',
    color: '#991b1b',
    bg: '#fef2f2',
    border: '#fecaca',
    title: 'Booking Cancelled',
    body: 'Unfortunately, your booking has been cancelled. Please contact the business or make a new booking.',
  },
  COMPLETED: {
    emoji: '🎉',
    color: '#1e40af',
    bg: '#eff6ff',
    border: '#bfdbfe',
    title: 'Service Completed',
    body: 'We hope you had a great experience! Please take a moment to leave a review.',
  },
  NO_SHOW: {
    emoji: '⚠️',
    color: '#92400e',
    bg: '#fffbeb',
    border: '#fde68a',
    title: 'Booking Marked as No-Show',
    body: 'Your booking was marked as a no-show. If you believe this is an error, please contact the business.',
  },
};

export const BookingStatusEmail = ({
  customerName = 'Customer',
  businessName = 'Business',
  serviceType = '',
  date = '',
  time = '',
  status,
  businessSlug = '',
  notes,
}: BookingStatusEmailProps) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Html>
      <Head />
      <Preview>{`${cfg.emoji} Booking ${status.toLowerCase()} — ${businessName}`}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <Section style={{ textAlign: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Mzansi Services</Text>
          </Section>

          <Text style={{ fontSize: 22, fontWeight: 'bold', color: cfg.color, margin: '0 0 8px 0' }}>
            {cfg.emoji} {cfg.title}
          </Text>
          <Text style={{ fontSize: 16, color: '#4b5563', margin: '0 0 24px 0' }}>
            Hi <strong>{customerName}</strong>, {cfg.body}
          </Text>

          <Section style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, padding: 20, borderRadius: 8, margin: '0 0 24px 0' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: cfg.color, margin: '0 0 12px 0' }}>Booking Summary</Text>
            <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Business:</strong> {businessName}</Text>
            <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Service:</strong> {serviceType}</Text>
            <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Date:</strong> {date}</Text>
            <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Time:</strong> {time}</Text>
            <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Status:</strong> {status}</Text>
          </Section>

          {status === 'COMPLETED' && (
            <Section style={{ textAlign: 'center', margin: '0 0 24px 0' }}>
              <Link
                href={`https://www.namibiaservices.com/listing-stay-detail/${businessSlug}`}
                style={{ display: 'inline-block', backgroundColor: '#059669', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16 }}
              >
                Leave a Review
              </Link>
            </Section>
          )}

          {status === 'CONFIRMED' && (
            <Section style={{ textAlign: 'center', margin: '0 0 24px 0' }}>
              <Link
                href={`https://www.namibiaservices.com/listing-stay-detail/${businessSlug}`}
                style={{ display: 'inline-block', backgroundColor: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16 }}
              >
                View Business
              </Link>
            </Section>
          )}

          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>© 2025 Mzansi Services. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BookingStatusEmail;
