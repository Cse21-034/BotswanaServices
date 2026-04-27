import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface SubscriptionCancelledEmailProps {
  businessName: string;
  planName: string;
}

export const SubscriptionCancelledEmail = ({
  businessName = 'Your Business',
  planName = 'Desert Elephants',
}: SubscriptionCancelledEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {planName} subscription has been cancelled</Preview>
    <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Mzansi Services
          </Text>
        </Section>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', margin: '0 0 16px 0' }}>
          Subscription Cancelled
        </Text>

        <Text style={{ fontSize: 16, margin: '16px 0' }}>
          Hello <strong>{businessName}</strong>,
        </Text>
        <Text style={{ fontSize: 16, margin: '16px 0' }}>
          Your <strong>{planName}</strong> subscription has been cancelled. Your business has been moved to the free Wild Horses plan.
        </Text>

        <Section style={{ background: '#fef3c7', border: '1px solid #fde68a', padding: 16, borderRadius: 8, margin: '24px 0' }}>
          <Text style={{ fontSize: 14, margin: 0, color: '#92400e' }}>
            ⚠️ You will lose access to premium features including additional photos, promotions, branches, and more.
          </Text>
        </Section>

        <Text style={{ fontSize: 16, margin: '16px 0' }}>
          Changed your mind? You can resubscribe at any time from your dashboard.
        </Text>

        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Link href="https://www.namibiaservices.com/business" style={{
            display: 'inline-block', backgroundColor: '#2563eb', color: '#fff',
            padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16,
          }}>
            Resubscribe Now
          </Link>
        </Section>

        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>
          © 2025 Mzansi Services. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SubscriptionCancelledEmail;
