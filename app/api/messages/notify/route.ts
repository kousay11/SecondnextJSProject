import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/prisma/client';

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ notify: false });
  }
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    select: { id: true }
  });
  if (!dbUser) {
    return NextResponse.json({ notify: false });
  }
  const count = await prisma.message.count({
    where: {
      userId: dbUser.id,
      status: 'PROCESSED',
      notified: false
    }
  });
  return NextResponse.json({ notify: count > 0 });
}
