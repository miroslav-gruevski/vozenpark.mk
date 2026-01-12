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
  MenuItem,
  alpha,
  useTheme,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  PersonAddOutlined,
  LanguageOutlined,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { getTranslations, getLanguageFromStorage, languages } from '@/lib/i18n';
import { signup } from '@/lib/api';
import { fadeInUp, staggerContainer } from '@/lib/theme';
import type { Language as LanguageType } from '@/types';

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  language: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const theme = useTheme();
  const [language, setLanguage] = useState<LanguageType>('mk');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
  }, []);

  const t = getTranslations(language);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      language: 'mk',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      await signup(data.email, data.password, data.language);
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
              {t.common.createAccount}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              {t.common.alreadyHaveAccount}{' '}
              <Typography
                component={Link}
                href="/login"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                {t.common.login}
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

                    {/* Confirm Password */}
                    <Controller
                      name="confirmPassword"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t.common.confirmPassword}
                          type={showConfirmPassword ? 'text' : 'password'}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword ? t.errors.passwordsDontMatch : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlined color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />

                    {/* Language */}
                    <Controller
                      name="language"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label={t.common.language}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LanguageOutlined color="action" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          {languages.map((lang) => (
                            <MenuItem key={lang.code} value={lang.code}>
                              <span style={{ marginRight: 8, fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>{lang.flag}</span> {lang.name}
                            </MenuItem>
                          ))}
                        </TextField>
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
                        startIcon={!isSubmitting && <PersonAddOutlined />}
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
                          t.common.signup
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
