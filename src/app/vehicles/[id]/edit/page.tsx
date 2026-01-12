import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { EditVehicleClient } from './EditVehicleClient';
import type { Language } from '@/types';

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!vehicle) {
    notFound();
  }

  return (
    <EditVehicleClient 
      vehicle={JSON.parse(JSON.stringify(vehicle))}
      userLanguage={user.language as Language}
    />
  );
}
