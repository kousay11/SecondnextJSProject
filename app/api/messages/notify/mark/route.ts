import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/prisma/client';

export async function POST() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ success: false });
  }
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { id: true }
  });
  if (!dbUser) {
    return NextResponse.json({ success: false });
  }
  await prisma.message.updateMany({
    where: {
      userId: dbUser.id,
      status: 'PROCESSED',
      notified: false
    },
    data: { notified: true }
  });
  return NextResponse.json({ success: true });
}
