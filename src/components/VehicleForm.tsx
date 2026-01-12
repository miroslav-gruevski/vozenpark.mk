'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  InputAdornment,
  IconButton,
  alpha,
  useTheme,
  Breadcrumbs,
} from '@mui/material';
import {
  DirectionsCar,
  CalendarMonth,
  Security,
  Build,
  Save,
  ArrowBack,
  NavigateNext,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { createVehicle, updateVehicle } from '@/lib/api';
import { formatDateForInput } from '@/lib/dates';
import { fadeInUp, staggerContainer } from '@/lib/theme';
import type { Language, Vehicle } from '@/types';

const vehicleSchema = z.object({
  plate: z.string().min(1, 'Plate is required').max(20),
  regExpiry: z.string().min(1, 'Registration expiry is required'),
  insExpiry: z.string().min(1, 'Insurance expiry is required'),
  inspExpiry: z.string().min(1, 'Inspection expiry is required'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  language: Language;
  vehicle?: Vehicle;
  mode: 'create' | 'edit';
}

export function VehicleForm({ language, vehicle, mode }: VehicleFormProps) {
  const router = useRouter();
  const theme = useTheme();
  const t = getTranslations(language);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          plate: vehicle.plate,
          regExpiry: formatDateForInput(vehicle.regExpiry),
          insExpiry: formatDateForInput(vehicle.insExpiry),
          inspExpiry: formatDateForInput(vehicle.inspExpiry),
        }
      : undefined,
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsSubmitting(true);
      if (mode === 'create') {
        await createVehicle(data);
        toast.success(t.common.success);
      } else if (vehicle) {
        await updateVehicle(vehicle.id, data);
        toast.success(t.common.success);
      }
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : t.errors.somethingWentWrong;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Breadcrumbs */}
        <motion.div variants={fadeInUp}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Typography
              component={Link}
              href="/dashboard"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              {t.common.dashboard}
            </Typography>
            <Typography color="text.primary">
              {mode === 'create' ? t.vehicles.addNew : t.vehicles.editVehicle}
            </Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeInUp}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <DirectionsCar sx={{ fontSize: 28, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {mode === 'create' ? t.vehicles.addNew : t.vehicles.editVehicle}
            </Typography>
          </Stack>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={fadeInUp}>
          <Card
            sx={{
              boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {/* Plate */}
                  <Controller
                    name="plate"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t.vehicles.plate}
                        placeholder="SK-1234-AB"
                        error={!!errors.plate}
                        helperText={errors.plate ? t.errors.plateRequired : ''}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DirectionsCar color="action" />
                            </InputAdornment>
                          ),
                          sx: { textTransform: 'uppercase' },
                        }}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                      />
                    )}
                  />

                  {/* Registration Expiry */}
                  <Controller
                    name="regExpiry"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label={t.vehicles.regExpiry}
                        error={!!errors.regExpiry}
                        helperText={errors.regExpiry ? t.errors.dateRequired : ''}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarMonth sx={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Insurance Expiry */}
                  <Controller
                    name="insExpiry"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label={t.vehicles.insExpiry}
                        error={!!errors.insExpiry}
                        helperText={errors.insExpiry ? t.errors.dateRequired : ''}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Security sx={{ color: theme.palette.warning.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Inspection Expiry */}
                  <Controller
                    name="inspExpiry"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="date"
                        label={t.vehicles.inspExpiry}
                        error={!!errors.inspExpiry}
                        helperText={errors.inspExpiry ? t.errors.dateRequired : ''}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Build sx={{ color: theme.palette.success.main }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  {/* Buttons */}
                  <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Button
                      component={Link}
                      href="/dashboard"
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      sx={{ flex: 1, py: 1.5 }}
                    >
                      {t.common.cancel}
                    </Button>
                    <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={!isSubmitting && <Save />}
                        sx={{
                          py: 1.5,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            ⏳
                          </motion.div>
                        ) : (
                          t.common.save
                        )}
                      </Button>
                    </motion.div>
                  </Stack>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Container>
  );
}
