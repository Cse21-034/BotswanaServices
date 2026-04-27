import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface NewReviewEmailProps {
  businessName: string;
  reviewerName: string;
  rating: number;
  comment?: string;
  businessSlug: string;
}

export const NewReviewEmail = ({
  businessName = 'Your Business',
  reviewerName = 'A customer',
  rating = 5,
  comment = '',
  businessSlug = '',
}: NewReviewEmailProps) => {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <Html>
      <Head />
      <Preview>{`New ${rating}-star review on ${businessName}`}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <Section style={{ textAlign: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              Mzansi Services
            </Text>
          </Section>

          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', margin: '0 0 16px 0' }}>
            New Review Received!
          </Text>

          <Text style={{ fontSize: 16, margin: '0 0 16px 0' }}>
            Hello <strong>{businessName}</strong>, you have a new review from a customer.
          </Text>

          <Section style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 20, borderRadius: 8, margin: '24px 0' }}>
            <Text style={{ fontSize: 24, margin: '0 0 8px 0', color: '#d97706' }}>{stars}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', margin: '0 0 8px 0' }}>{rating} out of 5 stars</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px 0' }}>
              by <strong>{reviewerName}</strong>
            </Text>
            {comment && (
              <Text style={{ fontSize: 15, color: '#374151', fontStyle: 'italic', margin: 0 }}>
                "{comment}"
              </Text>
            )}
          </Section>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Link
              href={`https://www.namibiaservices.com/listing-stay-detail/${businessSlug}`}
              style={{
                display: 'inline-block', backgroundColor: '#059669', color: '#fff',
                padding: '12px 24px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16,
              }}
            >
              View Your Reviews
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
};

export default NewReviewEmail;
