'use client';

import { useState, useEffect } from 'react';
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
  Alert,
  alpha,
  useTheme,
  Divider,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LoginOutlined,
  StarOutlined,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { getTranslations, getLanguageFromStorage } from '@/lib/i18n';
import { login } from '@/lib/api';
import { fadeInUp, staggerContainer } from '@/lib/theme';
import type { Language } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const [language, setLanguage] = useState<Language>('mk');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
  }, []);

  const t = getTranslations(language);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : t.errors.invalidCredentials;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'demo@vozenpark.mk');
    setValue('password', 'demo123');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Logo */}
          <motion.div variants={fadeInUp}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 4 }}>
              <Box
                component={Link}
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                }}
              >
                <Box
                  component="img"
                  src="/VozenPark_logo.svg"
                  alt="VozenPark"
                  sx={{ height: 26 }}
                />
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ lineHeight: 1 }}>
                  VozenPark.mk
                </Typography>
              </Box>
            </Stack>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeInUp}>
            <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
              {t.common.signInToAccount}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              {t.common.dontHaveAccount}{' '}
              <Typography
                component={Link}
                href="/signup"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                {t.common.signup}
              </Typography>
            </Typography>
          </motion.div>

          {/* Card */}
          <motion.div variants={fadeInUp}>
            <Card
              sx={{
                boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.1)}`,
                overflow: 'visible',
                borderRadius: '28px', // MD3 Extra large shape
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Demo Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={fillDemoCredentials}
                    startIcon={<StarOutlined sx={{ color: 'warning.main' }} />}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      borderRadius: '20px',
                      borderColor: alpha(theme.palette.warning.main, 0.3),
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      color: 'warning.dark',
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: 'warning.main',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                      },
                    }}
                  >
                    {{
                      en: 'Use Demo Account',
                      mk: 'Користете демо сметка',
                      sq: 'Përdorni llogari demo',
                      tr: 'Demo Hesabı Kullan',
                      sr: 'Користите демо налог',
                    }[language]}
                  </Button>
                </motion.div>

                <Divider sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t.common.or}
                  </Typography>
                </Divider>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    {/* Email */}
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t.common.email}
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email ? t.errors.invalidEmail : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlined color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />

                    {/* Password */}
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t.common.password}
                          type={showPassword ? 'text' : 'password'}
                          error={!!errors.password}
                          helperText={errors.password ? t.errors.passwordTooShort : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlined color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />

                    {/* Submit */}
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        startIcon={!isSubmitting && <LoginOutlined />}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 600,
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
                          t.common.login
                        )}
                      </Button>
                    </motion.div>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
