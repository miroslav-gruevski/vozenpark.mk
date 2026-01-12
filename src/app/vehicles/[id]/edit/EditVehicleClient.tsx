'use client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Header } from '@/components/Header';
import { VehicleForm } from '@/components/VehicleForm';
import { getLanguageFromStorage, setLanguageToStorage } from '@/lib/i18n';
import type { Language, Vehicle } from '@/types';

interface EditVehicleClientProps {
  vehicle: Vehicle;
  userLanguage: Language;
}

export function EditVehicleClient({ vehicle, userLanguage }: EditVehicleClientProps) {
  const [language, setLanguage] = useState<Language>(userLanguage);

  useEffect(() => {
    const storedLang = getLanguageFromStorage();
    if (storedLang !== userLanguage) {
      setLanguageToStorage(userLanguage);
    }
    setLanguage(userLanguage);
  }, [userLanguage]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLanguageToStorage(lang);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isAuthenticated={true}
      />
      <VehicleForm language={language} vehicle={vehicle} mode="edit" />
    </Box>
  );
}
