import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Hr, Link } from '@react-email/components';

interface UserWelcomeEmailProps {
  userName: string;
  userEmail: string;
}

export const UserWelcomeEmail = ({
  userName = 'there',
  userEmail = '',
}: UserWelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Botswana Services — discover the best local businesses</Preview>
    <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif', color: '#374151' }}>
      <Container style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e5e7eb' }}>
        <Section style={{ textAlign: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Botswana Services</Text>
        </Section>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#059669', margin: '0 0 16px 0' }}>
          Welcome, {userName}! 🎉
        </Text>

        <Text style={{ fontSize: 16, margin: '0 0 16px 0' }}>
          Your account has been created successfully. You can now browse, review, and bookmark the best businesses across Botswana.
        </Text>

        <Section style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 20, borderRadius: 8, margin: '24px 0' }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#166534', margin: '0 0 12px 0' }}>What you can do:</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '4px 0' }}>✓ Browse thousands of verified businesses</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '4px 0' }}>✓ Leave reviews and ratings</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '4px 0' }}>✓ Save your favourite businesses</Text>
          <Text style={{ fontSize: 14, color: '#374151', margin: '4px 0' }}>✓ Book services directly</Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Link
            href="https://www.namibiaservices.com"
            style={{ display: 'inline-block', backgroundColor: '#059669', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 'bold', textDecoration: 'none', fontSize: 16 }}
          >
            Explore Businesses
          </Link>
        </Section>

        <Text style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 4px 0' }}>Signed in as: {userEmail}</Text>
        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
        <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' as const }}>© 2025 Botswana Services. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
);

export default UserWelcomeEmail;
