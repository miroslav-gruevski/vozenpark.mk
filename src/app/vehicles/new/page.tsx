import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NewVehicleClient } from './NewVehicleClient';
import type { Language } from '@/types';

export default async function NewVehiclePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return <NewVehicleClient userLanguage={user.language as Language} />;
}
