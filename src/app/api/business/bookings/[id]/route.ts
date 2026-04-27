import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { BookingStatusEmail } from '@/emails/BookingStatusEmail';
import { createNotification } from '@/lib/notifications';
import React from 'react';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
type BookingStatus = typeof VALID_STATUSES[number];

const STATUS_MESSAGES: Record<BookingStatus, { title: string; message: string }> = {
  CONFIRMED: { title: 'Booking Confirmed', message: 'Your booking has been confirmed by the business.' },
  CANCELLED: { title: 'Booking Cancelled', message: 'Your booking has been cancelled.' },
  COMPLETED: { title: 'Service Completed', message: 'Your booking is marked as completed. Please leave a review!' },
  NO_SHOW: { title: 'Booking No-Show', message: 'Your booking was marked as no-show.' },
  PENDING: { title: 'Booking Pending', message: 'Your booking is pending confirmation.' },
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'BUSINESS') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await req.json();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const business = await prisma.business.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, slug: true },
    });
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const booking = await prisma.booking.findFirst({
      where: { id: params.id, businessId: business.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });

    const dateStr = new Date(booking.date).toLocaleDateString('en-NA', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

    // Send email to customer (non-blocking)
    if (['CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(status)) {
      try {
        await sendEmail({
          to: booking.customerEmail,
          subject: `${STATUS_MESSAGES[status as BookingStatus].title} — ${business.name}`,
          react: React.createElement(BookingStatusEmail, {
            customerName: booking.customerName,
            businessName: business.name,
            serviceType: booking.serviceType,
            date: dateStr,
            time: booking.time,
            status: status as 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW',
            businessSlug: business.slug,
          }),
        });
      } catch (e) {
        console.error('Booking status email failed:', e);
      }

      // In-app notification to the booking user if they have an account
      if (booking.userId) {
        try {
          await createNotification({
            userId: booking.userId,
            type: 'BOOKING',
            title: STATUS_MESSAGES[status as BookingStatus].title,
            message: `${STATUS_MESSAGES[status as BookingStatus].message} (${booking.serviceType} at ${business.name})`,
            data: { bookingId: booking.id, businessSlug: business.slug },
          });
        } catch (e) {
          console.error('Booking notification failed:', e);
        }
      }
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
