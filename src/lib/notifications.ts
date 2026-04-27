import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type NotificationType = 'REVIEW' | 'BOOKING' | 'SYSTEM' | 'PROMOTIONAL';

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      data: (input.data ?? {}) as Prisma.InputJsonValue,
    },
  });
}
