import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { DashboardClient } from './DashboardClient';
import type { Language } from '@/types';

// Demo user ID must match the one in auth.ts
const DEMO_USER_ID = 'demo-user-id';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  // Demo user: redirect to the interactive demo page
  if (user.id === DEMO_USER_ID) {
    redirect('/demo');
  }

  const vehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardClient 
      vehicles={JSON.parse(JSON.stringify(vehicles))}
      userLanguage={user.language as Language}
    />
  );
}
