import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface PaymentSuccessEmailProps {
  businessName: string;
  ownerEmail: string;
  planName: string;
  amount: number;
  billingCycle: string;
  renewalDate: string;
  transactionRef: string;
}

export const PaymentSuccessEmail = ({
  businessName = 'Your Business',
  ownerEmail = '',
  planName = 'Desert Elephants',
  amount = 100,
  billingCycle = 'MONTHLY',
  renewalDate = '',
  transactionRef = '',
}: PaymentSuccessEmailProps) => (
  <Html>
    <Head />
    <Preview>Payment confirmed — {planName} plan is now active</Preview>
    <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Botswana Services
          </Text>
        </Section>

        <Section style={{ background: '#d1fae5', padding: 16, borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#065f46', margin: 0 }}>
            ✅ Payment Successful!
          </Text>
        </Section>

        <Text style={{ fontSize: 16, margin: '16px 0' }}>
          Hello <strong>{businessName}</strong>,
        </Text>
        <Text style={{ fontSize: 16, margin: '16px 0' }}>
          Your payment has been confirmed and your <strong>{planName}</strong> subscription is now active.
        </Text>

        <Section style={{ background: '#f3f4f6', padding: 20, borderRadius: 8, margin: '24px 0' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', margin: '0 0 12px 0' }}>
            Payment Details
          </Text>
          <Text style={{ fontSize: 14, margin: '4px 0' }}><strong>Plan:</strong> {planName}</Text>
          <Text style={{ fontSize: 14, margin: '4px 0' }}><strong>Amount:</strong> N${amount}</Text>
          <Text style={{ fontSize: 14, margin: '4px 0' }}><strong>Billing:</strong> {billingCycle === 'YEARLY' ? 'Yearly' : 'Monthly'}</Text>
          {renewalDate && <Text style={{ fontSize: 14, margin: '4px 0' }}><strong>Next renewal:</strong> {renewalDate}</Text>}
          <Text style={{ fontSize: 14, margin: '4px 0', color: '#6b7280' }}><strong>Reference:</strong> {transactionRef}</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Link href="https://www.namibiaservices.com/business" style={{
            display: 'inline-block', backgroundColor: '#059669', color: '#fff',
            padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16,
          }}>
            Go to Your Dashboard
          </Link>
        </Section>

        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          Questions? Contact us at <strong>support@namibiaservices.com</strong>
        </Text>

        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>
          © 2025 Botswana Services. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PaymentSuccessEmail;
