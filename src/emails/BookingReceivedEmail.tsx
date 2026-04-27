import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface BookingReceivedEmailProps {
  businessName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  date: string;
  time: string;
  duration?: number;
  notes?: string;
  businessSlug: string;
}

export const BookingReceivedEmail = ({
  businessName = 'Your Business',
  customerName = 'A customer',
  customerEmail = '',
  customerPhone = '',
  serviceType = '',
  date = '',
  time = '',
  duration,
  notes,
  businessSlug = '',
}: BookingReceivedEmailProps) => (
  <Html>
    <Head />
    <Preview>{`New booking from ${customerName} for ${serviceType}`}</Preview>
    <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Botswana Services</Text>
        </Section>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
          📅 New Booking Received!
        </Text>
        <Text style={{ fontSize: 16, color: '#4b5563', margin: '0 0 24px 0' }}>
          <strong>{businessName}</strong>, you have a new booking request.
        </Text>

        <Section style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: 20, borderRadius: 8, margin: '0 0 24px 0' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1e40af', margin: '0 0 12px 0' }}>Booking Details</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Service:</strong> {serviceType}</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Date:</strong> {date}</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Time:</strong> {time}</Text>
          {duration && <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Duration:</strong> {duration} minutes</Text>}
        </Section>

        <Section style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: 20, borderRadius: 8, margin: '0 0 24px 0' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#374151', margin: '0 0 12px 0' }}>Customer Details</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Name:</strong> {customerName}</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Email:</strong> {customerEmail}</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Phone:</strong> {customerPhone}</Text>
          {notes && <Text style={{ fontSize: 14, color: '#374151', margin: '6px 0' }}><strong>Notes:</strong> {notes}</Text>}
        </Section>

        <Text style={{ fontSize: 14, color: '#6b7280', margin: '0 0 20px 0' }}>
          Please confirm or decline this booking promptly. Customers expect a timely response.
        </Text>

        <Section style={{ textAlign: 'center', margin: '0 0 24px 0' }}>
          <Link
            href={`https://www.namibiaservices.com/business?tab=bookings`}
            style={{ display: 'inline-block', backgroundColor: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16 }}
          >
            Manage Booking
          </Link>
        </Section>

        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>© 2025 Botswana Services. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
);

export default BookingReceivedEmail;
