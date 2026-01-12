'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { Add, DirectionsCar } from '@mui/icons-material';
import { Header } from '@/components/Header';
import { StatusCards } from '@/components/StatusCard';
import { VehicleTable } from '@/components/VehicleTable';
import { getTranslations, getLanguageFromStorage, setLanguageToStorage } from '@/lib/i18n';
import { getMinExpiryStatus } from '@/lib/dates';
import { fadeInUp, staggerContainer } from '@/lib/theme';
import type { Language, Vehicle, StatusCount } from '@/types';

interface DashboardClientProps {
  vehicles: Vehicle[];
  userLanguage: Language;
}

export function DashboardClient({ vehicles, userLanguage }: DashboardClientProps) {
  const theme = useTheme();
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
    fetch('/api/user/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang }),
    }).catch(console.error);
  };

  const t = getTranslations(language);

  const statusCounts = useMemo<StatusCount>(() => {
    const counts = { urgent: 0, soon: 0, ok: 0 };
    
    for (const vehicle of vehicles) {
      const minExpiry = getMinExpiryStatus(
        new Date(vehicle.regExpiry),
        new Date(vehicle.insExpiry),
        new Date(vehicle.inspExpiry)
      );
      
      if (minExpiry.status === 'expired' || minExpiry.status === 'urgent') {
        counts.urgent++;
      } else if (minExpiry.status === 'soon') {
        counts.soon++;
      } else {
        counts.ok++;
      }
    }
    
    return counts;
  }, [vehicles]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isAuthenticated={true}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Header Section */}
          <motion.div variants={fadeInUp}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  {t.common.dashboard}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {vehicles.length === 0 
                    ? t.common.noVehicles
                    : `${vehicles.length} ${vehicles.length === 1 ? 'vehicle' : 'vehicles'}`
                  }
                </Typography>
              </Box>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  component={Link}
                  href="/vehicles/new"
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  {t.common.addVehicle}
                </Button>
              </motion.div>
            </Stack>
          </motion.div>

          {/* Status Cards */}
          {vehicles.length > 0 && (
            <motion.div variants={fadeInUp}>
              <Box sx={{ mb: 4 }}>
                <StatusCards 
                  urgent={statusCounts.urgent}
                  soon={statusCounts.soon}
                  ok={statusCounts.ok}
                  language={language}
                />
              </Box>
            </motion.div>
          )}

          {/* Vehicle List */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <DirectionsCar sx={{ color: 'text.secondary' }} />
                  <Typography variant="h6" fontWeight={600}>
                    {language === 'en' ? 'Your Vehicles' : 'Ваши возила'}
                  </Typography>
                </Stack>
                <VehicleTable vehicles={vehicles} language={language} />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
