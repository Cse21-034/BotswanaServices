import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface BusinessStatusEmailProps {
  businessName: string;
  status: 'PUBLISHED' | 'SUSPENDED' | 'REJECTED';
  rejectionReason?: string;
}

export const BusinessStatusEmail = ({
  businessName = 'Your Business',
  status = 'PUBLISHED',
  rejectionReason = '',
}: BusinessStatusEmailProps) => {
  const isApproved = status === 'PUBLISHED';
  const isSuspended = status === 'SUSPENDED';

  return (
    <Html>
      <Head />
      <Preview>{isApproved ? `${businessName} is now live on Botswana Services!` : `Update on your ${businessName} listing`}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <Section style={{ textAlign: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Botswana Services
            </Text>
          </Section>

          <Section style={{
            background: isApproved ? '#d1fae5' : isSuspended ? '#fef3c7' : '#fee2e2',
            padding: 16, borderRadius: 8, marginBottom: 24, textAlign: 'center',
          }}>
            <Text style={{
              fontSize: 20, fontWeight: 'bold', margin: 0,
              color: isApproved ? '#065f46' : isSuspended ? '#92400e' : '#991b1b',
            }}>
              {isApproved ? '✅ Your business is now LIVE!' : isSuspended ? '⚠️ Business Suspended' : '❌ Listing Rejected'}
            </Text>
          </Section>

          <Text style={{ fontSize: 16, margin: '16px 0' }}>
            Hello <strong>{businessName}</strong>,
          </Text>

          {isApproved && (
            <>
              <Text style={{ fontSize: 16, margin: '16px 0' }}>
                Congratulations! Your business listing has been reviewed and approved by our team. Your business is now visible to all users on Botswana Services.
              </Text>
              <Section style={{ textAlign: 'center', margin: '24px 0' }}>
                <Link href="https://www.namibiaservices.com/business" style={{
                  display: 'inline-block', backgroundColor: '#059669', color: '#fff',
                  padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16,
                }}>
                  Visit Your Dashboard
                </Link>
              </Section>
              <Text style={{ fontSize: 15, color: '#374151', margin: '16px 0' }}>
                Consider upgrading your plan to unlock more features — add more photos, create promotions, and get top search placement.
              </Text>
            </>
          )}

          {isSuspended && (
            <Text style={{ fontSize: 16, margin: '16px 0' }}>
              Your business listing has been temporarily suspended. Please contact our support team at <strong>support@namibiaservices.com</strong> for more information.
            </Text>
          )}

          {!isApproved && !isSuspended && (
            <>
              <Text style={{ fontSize: 16, margin: '16px 0' }}>
                Unfortunately, your business listing could not be approved at this time.
              </Text>
              {rejectionReason && (
                <Section style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: 16, borderRadius: 8, margin: '16px 0' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 8px 0' }}>Reason:</Text>
                  <Text style={{ fontSize: 14, margin: 0 }}>{rejectionReason}</Text>
                </Section>
              )}
              <Text style={{ fontSize: 16, margin: '16px 0' }}>
                Please update your listing and resubmit, or contact us at <strong>support@namibiaservices.com</strong> for assistance.
              </Text>
            </>
          )}

          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>
            © 2025 Botswana Services. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default BusinessStatusEmail;
