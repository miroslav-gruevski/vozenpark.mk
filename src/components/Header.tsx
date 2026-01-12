'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Box,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Logout,
  KeyboardArrowDown,
  Check,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getTranslations, setLanguageToStorage, languages } from '@/lib/i18n';
import { logout } from '@/lib/api';
import type { Language } from '@/types';
import { toast } from 'sonner';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isAuthenticated?: boolean;
}

export function Header({ language, onLanguageChange, isAuthenticated = false }: HeaderProps) {
  const router = useRouter();
  const theme = useTheme();
  const t = getTranslations(language);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/');
      router.refresh();
    } catch {
      toast.error(t.errors.somethingWentWrong);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguageToStorage(lang);
    onLanguageChange(lang);
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, sm: 3 } }}>
          {/* Logo */}
          <Box
            component={Link}
            href={isAuthenticated ? '/dashboard' : '/'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src="/VozenPark_logo.svg"
              alt="VozenPark"
              sx={{ height: 20 }}
            />
            <Typography 
              fontWeight={600} 
              color="text.primary" 
              sx={{ 
                lineHeight: 1,
                fontSize: '1rem',
              }}
            >
              VozenPark.mk
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Language Selector */}
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                minWidth: 'auto',
                px: 1.5,
              }}
            >
              {language.toUpperCase()}
            </Button>

            {!isAuthenticated && (
              <>
                {/* Divider */}
                <Typography sx={{ color: 'divider', mx: 0.5 }}>|</Typography>

                {/* Pricing Link */}
                <Button 
                  component={Link} 
                  href="/pricing" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    minWidth: 'auto',
                    px: 1.5,
                  }}
                >
                  {{ en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' }[language]}
                </Button>
              </>
            )}

            {isAuthenticated ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  startIcon={<Logout sx={{ fontSize: 18 }} />}
                  sx={{
                    color: 'error.main',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                    },
                  }}
                >
                  {t.common.logout}
                </Button>
              </motion.div>
            ) : (
              <Button 
                component={Link} 
                href="/login" 
                variant="contained"
                sx={{ 
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  borderRadius: 20,
                  px: 2.5,
                  py: 1,
                }}
              >
                {t.common.login}
              </Button>
            )}
          </Stack>

          {/* Mobile Hamburger Menu */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography fontWeight={600} color="text.primary">
              VozenPark.mk
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          
          {/* Navigation Links */}
          <List sx={{ flex: 1 }}>
            {!isAuthenticated && (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/pricing"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ListItemText primary={{ en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' }[language]} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/demo"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ListItemText primary={{ en: 'Demo', mk: 'Демо', sq: 'Demo', tr: 'Demo', sr: 'Демо' }[language]} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  disabled={isLoggingOut}
                >
                  <Logout sx={{ mr: 2, color: 'error.main' }} />
                  <ListItemText primary={t.common.logout} sx={{ color: 'error.main' }} />
                </ListItemButton>
              </ListItem>
            )}
          </List>

          {/* Sign In Button (if not authenticated) */}
          {!isAuthenticated && (
            <Button
              component={Link}
              href="/login"
              variant="contained"
              fullWidth
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 20,
                py: 1.25,
                mb: 2,
              }}
            >
              {t.common.login}
            </Button>
          )}

          {/* Language Selector at bottom */}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, px: 1 }}>
            {{ en: 'Language', mk: 'Јазик', sq: 'Gjuha', tr: 'Dil', sr: 'Језик' }[language]}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ px: 1 }}>
            {languages.map((lang) => (
              <Chip
                key={lang.code}
                label={lang.code.toUpperCase()}
                onClick={() => {
                  handleLanguageChange(lang.code);
                  setMobileOpen(false);
                }}
                variant={lang.code === language ? 'filled' : 'outlined'}
                color={lang.code === language ? 'primary' : 'default'}
                sx={{ 
                  fontWeight: 500,
                  minWidth: 48,
                }}
              />
            ))}
          </Stack>
        </Box>
      </Drawer>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { mt: 1, borderRadius: '12px', minWidth: 180 }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
            sx={{ gap: 1.5 }}
          >
            <span>{lang.flag}</span>
            {lang.name}
            {lang.code === language && <Check sx={{ ml: 'auto', fontSize: 18, color: 'primary.main' }} />}
          </MenuItem>
        ))}
      </Menu>

    </>
  );
}
