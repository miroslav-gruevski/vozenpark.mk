'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  DirectionsCarOutlined,
  NotificationsActiveOutlined,
  LanguageOutlined,
  SpeedOutlined,
  PhoneIphoneOutlined,
  EmailOutlined,
  CalendarMonthOutlined,
  BuildOutlined,
  SecurityOutlined,
  GroupsOutlined,
  LockOutlined,
  ArrowForwardOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  KeyboardArrowDownOutlined,
  WarningAmberOutlined,
  ScheduleOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  AddOutlined,
  AccessTimeOutlined,
  TrendingUpOutlined,
  MoreVertOutlined,
  DashboardOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@mui/icons-material';
import { getTranslations, getLanguageFromStorage, setLanguageToStorage, languages } from '@/lib/i18n';
import { fadeInUp, staggerContainer, md3 } from '@/lib/theme';
import type { Language as LanguageType } from '@/types';

// Interactive 3D Tilt Dashboard Preview Wrapper
function InteractiveDashboardPreview({ language }: { language: LanguageType }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '0deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200, cursor: 'default' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <DashboardPreview language={language} />
      </motion.div>
    </motion.div>
  );
}

// Enhanced Dashboard Preview with Table - matches current demo implementation
function DashboardPreview({ language }: { language: LanguageType }) {
  const theme = useTheme();
  
  // Translation helper for fuel types
  const fuelTranslations: Record<string, Record<string, string>> = {
    petrol: { en: 'Petrol', mk: 'Бензин', sq: 'Benzinë', tr: 'Benzin', sr: 'Бензин' },
    diesel: { en: 'Diesel', mk: 'Дизел', sq: 'Naftë', tr: 'Dizel', sr: 'Дизел' },
  };
  
  // Translation helper for status
  const statusTranslations: Record<string, Record<string, string>> = {
    expired: { en: 'Expired', mk: 'Истечено', sq: 'Skaduar', tr: 'Süresi Doldu', sr: 'Истекло' },
  };
  
  // Translated vehicle data - matching demo structure
  const vehicles = [
    { 
      model: 'Aeolus Mage', 
      owner: { en: 'Miroslav Gruevski', mk: 'Мирослав Груевски', sq: 'Miroslav Gruevski', tr: 'Miroslav Gruevski', sr: 'Мирослав Груевски' }[language] || 'Miroslav Gruevski',
      plate: 'BT 1580 AI', 
      vin: '9ZZAB12C3DE456789', 
      year: 2026,
      fuel: fuelTranslations.petrol[language] || fuelTranslations.petrol.en,
      type: 'car',
      status: 'expired',
      days: 0,
    },
    { 
      model: 'Audi A4 Avant', 
      owner: { en: 'Ana Jovanovska', mk: 'Ана Јовановска', sq: 'Ana Jovanovska', tr: 'Ana Jovanovska', sr: 'Ана Јовановска' }[language] || 'Ana Jovanovska',
      plate: 'KU 5678 CD', 
      vin: '5Y2BR4EE2XP123456', 
      year: 2021,
      fuel: fuelTranslations.diesel[language] || fuelTranslations.diesel.en,
      type: 'car',
      status: 'soon',
      days: 14,
    },
    { 
      model: 'Mercedes Sprinter', 
      owner: { en: 'Ivan Stojanov', mk: 'Иван Стојанов', sq: 'Ivan Stojanov', tr: 'Ivan Stojanov', sr: 'Иван Стојанов' }[language] || 'Ivan Stojanov',
      plate: 'OH 3456 GH', 
      vin: 'WDB9066331S789012', 
      year: 2018,
      fuel: fuelTranslations.diesel[language] || fuelTranslations.diesel.en,
      type: 'van',
      status: 'ok',
      days: 45,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return theme.palette.error.main;
      case 'soon': return theme.palette.warning.main;
      case 'ok': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string, days: number) => {
    if (status === 'expired') {
      return statusTranslations.expired[language] || statusTranslations.expired.en;
    }
    return `${days}d`;
  };

  // Translations for dashboard
  const dashboardText: Record<string, Record<string, string>> = {
    allVehicles: { en: 'All Vehicles', mk: 'Сите возила', sq: 'Të gjitha', tr: 'Tüm Araçlar', sr: 'Сва возила' },
    needsAttention: { en: 'Needs Attention', mk: 'Бараат внимание', sq: 'Kërkon vëmendje', tr: 'Dikkat Gerekiyor', sr: 'Треба пажња' },
    dueSoon: { en: 'Due Soon', mk: 'Наскоро', sq: 'Së shpejti', tr: 'Yakında', sr: 'Ускоро' },
    allGood: { en: 'All Good', mk: 'Во ред', sq: 'Në rregull', tr: 'Tamam', sr: 'У реду' },
    yourVehicles: { en: 'Your Vehicles', mk: 'Ваши возила', sq: 'Automjetet tuaja', tr: 'Araçlarınız', sr: 'Ваша возила' },
    companyName: { en: 'Your Company Ltd.', mk: 'Ваша Компанија ДООЕЛ', sq: 'Kompania Juaj SH.P.K.', tr: 'Şirketiniz Ltd.', sr: 'Ваша Фирма д.о.о.' },
    importCSV: { en: 'Import CSV', mk: 'Увези CSV', sq: 'Importo CSV', tr: 'CSV İçe Aktar', sr: 'Увези CSV' },
    addVehicle: { en: 'Add Vehicle', mk: 'Додај возило', sq: 'Shto automjet', tr: 'Araç Ekle', sr: 'Додај возило' },
    searchPlaceholder: { en: 'Search...', mk: 'Пребарај...', sq: 'Kërko...', tr: 'Ara...', sr: 'Претражи...' },
    vehicleModel: { en: 'Vehicle Model', mk: 'Модел', sq: 'Modeli', tr: 'Model', sr: 'Модел' },
    year: { en: 'Year', mk: 'Година', sq: 'Viti', tr: 'Yıl', sr: 'Година' },
    fuelType: { en: 'Fuel', mk: 'Гориво', sq: 'Karburanti', tr: 'Yakıt', sr: 'Гориво' },
    plateVin: { en: 'Plate / VIN', mk: 'Таблица / VIN', sq: 'Targa / VIN', tr: 'Plaka / VIN', sr: 'Таблица / VIN' },
    expiration: { en: 'Status', mk: 'Статус', sq: 'Statusi', tr: 'Durum', sr: 'Статус' },
  };

  const dt = (key: string) => dashboardText[key]?.[language] || dashboardText[key]?.['en'] || key;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: `
            0 4px 6px -1px ${alpha('#000', 0.07)},
            0 10px 20px -5px ${alpha('#000', 0.1)},
            0 25px 50px -12px ${alpha('#000', 0.15)}
          `,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          bgcolor: 'background.paper',
        }}
      >
        {/* Browser Chrome */}
        <Box
          sx={{
            height: { xs: 32, sm: 44 },
            bgcolor: '#F8F9FA',
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            px: { xs: 1.5, sm: 2 },
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 0.75 } }}>
            <Box sx={{ width: { xs: 8, sm: 12 }, height: { xs: 8, sm: 12 }, borderRadius: '50%', bgcolor: '#FF5F57' }} />
            <Box sx={{ width: { xs: 8, sm: 12 }, height: { xs: 8, sm: 12 }, borderRadius: '50%', bgcolor: '#FEBC2E' }} />
            <Box sx={{ width: { xs: 8, sm: 12 }, height: { xs: 8, sm: 12 }, borderRadius: '50%', bgcolor: '#28C840' }} />
          </Box>
          <Box
            sx={{
              flex: 1,
              mx: { xs: 2, sm: 6 },
              height: { xs: 20, sm: 28 },
              bgcolor: '#FFFFFF',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              component="img"
              src="/VozenPark_logo.svg"
              alt=""
              sx={{ height: { xs: 6, sm: 8 }, mr: 0.5, display: { xs: 'none', sm: 'block' } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 9, sm: 11 } }}>
              vozenpark.mk/dashboard
            </Typography>
          </Box>
        </Box>

        {/* Dashboard Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Stats Row - refined style */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {[
              { value: '12', label: dt('allVehicles'), color: theme.palette.primary.main, bgColor: alpha(theme.palette.primary.main, 0.08) },
              { value: '4', label: dt('needsAttention'), color: theme.palette.error.main, bgColor: alpha(theme.palette.error.main, 0.08) },
              { value: '3', label: dt('dueSoon'), color: theme.palette.warning.main, bgColor: alpha(theme.palette.warning.main, 0.08) },
              { value: '5', label: dt('allGood'), color: theme.palette.success.main, bgColor: alpha(theme.palette.success.main, 0.08) },
            ].map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: stat.bgColor,
                      border: `1px solid ${alpha(stat.color, 0.15)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 9, lineHeight: 1.2 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={600} sx={{ color: stat.color, fontSize: 16 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Title & Action Bar */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: 12, sm: 14 } }}>{dt('yourVehicles')}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: 9, sm: 11 } }}>{dt('companyName')}</Typography>
            </Box>
            <Stack direction="row" spacing={0.5}>
              <Button size="small" startIcon={<UploadOutlined sx={{ fontSize: { xs: 12, sm: 14 } }} />} variant="outlined" sx={{ borderRadius: 20, fontSize: { xs: 9, sm: 11 }, py: 0.5, px: { xs: 1, sm: 1.5 }, display: { xs: 'none', sm: 'flex' } }}>
                {dt('importCSV')}
              </Button>
              <Button size="small" startIcon={<AddOutlined sx={{ fontSize: { xs: 12, sm: 14 } }} />} variant="contained" sx={{ borderRadius: 20, fontSize: { xs: 9, sm: 11 }, py: 0.5, px: { xs: 1, sm: 1.5 } }}>
                {dt('addVehicle')}
              </Button>
            </Stack>
          </Stack>

          {/* Search */}
          <TextField
            size="small"
            fullWidth
            disabled
            placeholder={dt('searchPlaceholder')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 1.5, 
              pointerEvents: 'none', 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 20, 
                bgcolor: '#F8F9FA', 
                height: { xs: 28, sm: 36 },
                fontSize: { xs: 10, sm: 14 },
              } 
            }}
          />

          {/* Table - matching demo columns */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 11, py: 1 }}>
                    {dt('vehicleModel')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 11, py: 1, display: { xs: 'none', sm: 'table-cell' } }}>
                    {dt('year')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 11, py: 1, display: { xs: 'none', sm: 'table-cell' } }}>
                    {dt('fuelType')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 11, py: 1 }}>
                    {dt('plateVin')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 11, py: 1 }}>
                    {dt('expiration')}
                  </TableCell>
                  <TableCell sx={{ width: 40 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    component={TableRow}
                    sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}
                  >
                    <TableCell sx={{ py: 1.5 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DirectionsCarOutlined sx={{ fontSize: 18, color: 'text.disabled' }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>{vehicle.model}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{vehicle.owner}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>{vehicle.year}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>{vehicle.fuel}</Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" fontWeight={500} sx={{ fontSize: 12 }}>{vehicle.plate}</Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', fontSize: 9 }}>
                        {vehicle.vin}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={getStatusLabel(vehicle.status, vehicle.days)}
                        size="small"
                        sx={{
                          bgcolor: alpha(getStatusColor(vehicle.status), 0.1),
                          color: getStatusColor(vehicle.status),
                          fontWeight: 600,
                          fontSize: 10,
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <IconButton size="small"><MoreVertOutlined sx={{ fontSize: 16 }} /></IconButton>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Bottom padding for clean edge */}
          <Box sx={{ height: 16 }} />
        </Box>
      </Box>
    </motion.div>
  );
}

// Mini App Screen Components - Compact with unified styling
const miniScreenStyles = {
  width: 80, 
  height: 56, 
  bgcolor: 'white', 
  borderRadius: '4px',
  p: 0.75,
  mx: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.06)',
};

function MiniAddModal() {
  return (
    <Box sx={miniScreenStyles}>
      <Box sx={{ display: 'flex', gap: 0.3, mb: 0.5 }}>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#ff5f56' }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#27ca3f' }} />
      </Box>
      <Box sx={{ height: 6, bgcolor: '#E8EAED', borderRadius: '2px', mb: 0.3 }} />
      <Box sx={{ height: 6, bgcolor: '#E8EAED', borderRadius: '2px', mb: 0.3 }} />
      <Box sx={{ height: 8, bgcolor: 'primary.main', borderRadius: '2px', width: '50%', ml: 'auto' }} />
    </Box>
  );
}

function MiniTable() {
  return (
    <Box sx={miniScreenStyles}>
      <Box sx={{ display: 'flex', gap: 0.3, mb: 0.3 }}>
        {[1, 1, 1].map((_, i) => (
          <Box key={i} sx={{ height: 4, bgcolor: '#E8EAED', borderRadius: '1px', flex: 1 }} />
        ))}
      </Box>
      {[0, 1, 2].map((row) => (
        <Box key={row} sx={{ display: 'flex', gap: 0.3, mb: 0.25, alignItems: 'center' }}>
          <Box sx={{ height: 4, bgcolor: '#F4F6F7', borderRadius: '1px', flex: 1 }} />
          <Box sx={{ height: 4, bgcolor: '#F4F6F7', borderRadius: '1px', flex: 1 }} />
          <Box sx={{ 
            width: 12, 
            height: 6, 
            bgcolor: row === 0 ? 'error.main' : row === 1 ? 'warning.main' : 'success.main', 
            borderRadius: '2px',
            opacity: 0.9,
          }} />
        </Box>
      ))}
    </Box>
  );
}

function MiniNotification() {
  return (
    <Box sx={{ ...miniScreenStyles, bgcolor: '#F8F9FA', display: 'flex', flexDirection: 'column', gap: 0.3 }}>
      {['error.main', 'warning.main', 'primary.main'].map((color, i) => (
        <Box key={i} sx={{ 
          bgcolor: 'white', 
          borderRadius: '2px', 
          p: 0.4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.3,
          borderLeft: '2px solid',
          borderColor: color,
        }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, opacity: 0.3 }} />
          <Box sx={{ flex: 1, height: 4, bgcolor: '#E8EAED', borderRadius: '1px' }} />
        </Box>
      ))}
    </Box>
  );
}

// How It Works Step - with mini app screens
function ProcessStep({ 
  number,
  title, 
  description, 
  delay,
}: { 
  number: number;
  title: string; 
  description: string;
  icon: React.ElementType;
  delay: number;
  features?: string[];
  gradient?: string;
  stepLabel?: string;
}) {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card sx={{ 
        p: 3, 
        height: '100%', 
        textAlign: 'center',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: `0 16px 48px ${alpha(theme.palette.primary.main, 0.12)}`,
        },
      }}>
        <motion.div
          whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
        >
          <Box sx={{ mb: 2 }}>
            {number === 1 && <MiniAddModal />}
            {number === 2 && <MiniTable />}
            {number === 3 && <MiniNotification />}
          </Box>
        </motion.div>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
          {description}
        </Typography>
      </Card>
    </motion.div>
  );
}

// Feature Card
function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card sx={{ p: 3, height: '100%' }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            mb: 2,
          }}
        >
          <Icon sx={{ color: 'primary.main', fontSize: 24 }} />
        </Avatar>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
          {description}
        </Typography>
      </Card>
    </motion.div>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const [language, setLanguage] = useState<LanguageType>('mk');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
  }, []);

  const handleLanguageChange = (lang: LanguageType) => {
    setLanguage(lang);
    setLanguageToStorage(lang);
    setAnchorEl(null);
  };

  const t = getTranslations(language);
  const currentLang = languages.find(l => l.code === language);

  // All page translations
  const pageText: Record<string, Record<string, string>> = {
    freeTrial: { en: '✨ Free trial available', mk: '✨ Бесплатен пробен период', sq: '✨ Provë falas në dispozicion', tr: '✨ Ücretsiz deneme mevcut', sr: '✨ Бесплатна проба доступна' },
    heroLine1: { en: 'Never miss a', mk: 'Никогаш повеќе не пропуштајте', sq: 'Mos humbisni kurrë një', tr: 'Asla kaçırmayın', sr: 'Никада не пропустите' },
    heroLine2: { en: 'vehicle registration', mk: 'регистрација', sq: 'regjistrim automjeti', tr: 'araç kaydı', sr: 'регистрацију возила' },
    heroDesc: { 
      en: 'VozenPark reminds you on time about registration, insurance, and inspection expiry for all your vehicles.',
      mk: 'VozenPark ве потсетува навреме за истек на регистрација, осигурување и технички преглед на сите ваши возила.',
      sq: 'VozenPark ju kujton në kohë për skadimin e regjistrimit, sigurimit dhe kontrollit teknik për të gjitha automjetet tuaja.',
      tr: 'VozenPark, tüm araçlarınız için kayıt, sigorta ve muayene sürelerinin dolacağını size zamanında hatırlatır.',
      sr: 'VozenPark вас подсећа на време о истеку регистрације, осигурања и техничког прегледа за сва ваша возила.'
    },
    tryDemo: { en: 'Try Demo', mk: 'Пробајте демо', sq: 'Provo Demo', tr: 'Demo Dene', sr: 'Пробај демо' },
    getStarted: { en: 'Get Started', mk: 'Започнете', sq: 'Filloni', tr: 'Başla', sr: 'Започни' },
    howItWorks: { en: 'How does it work?', mk: 'Како функционира?', sq: 'Si funksionon?', tr: 'Nasıl çalışır?', sr: 'Како функционише?' },
    howItWorksDesc: { 
      en: 'Simple and effective way to manage your entire vehicle fleet',
      mk: 'Едноставен и ефикасен начин за управување со целиот ваш возен парк',
      sq: 'Mënyrë e thjeshtë dhe efektive për të menaxhuar të gjithë flotën tuaj të automjeteve',
      tr: 'Tüm araç filonuzu yönetmenin basit ve etkili yolu',
      sr: 'Једноставан и ефикасан начин за управљање целим возним парком'
    },
    stepLabel: { en: 'Step', mk: 'Чекор', sq: 'Hapi', tr: 'Adım', sr: 'Корак' },
    step1Title: { en: 'Add Vehicles', mk: 'Додајте возила', sq: 'Shtoni automjete', tr: 'Araç Ekle', sr: 'Додајте возила' },
    step1Desc: { 
      en: 'Quickly add your fleet vehicles with all important details. Import from CSV or add manually one by one.',
      mk: 'Брзо додајте возила од вашата флота со сите важни детали. Увезете од CSV или додајте рачно едно по едно.',
      sq: 'Shtoni shpejt automjetet e flotës tuaj me të gjitha detajet e rëndësishme. Importoni nga CSV ose shtoni manualisht.',
      tr: 'Filo araçlarınızı tüm önemli ayrıntılarla hızlıca ekleyin. CSV\'den içe aktarın veya tek tek manuel ekleyin.',
      sr: 'Брзо додајте возила из ваше флоте са свим важним детаљима. Увезите из CSV или додајте ручно.'
    },
    step1Features: {
      en: ['License plate, VIN, model, year', 'Registration, insurance, inspection dates', 'Responsible person assignment', 'CSV bulk import'],
      mk: ['Таблица, VIN, модел, година', 'Датуми за регистрација, осигурување, преглед', 'Назначување одговорно лице', 'Масовен увоз од CSV'],
      sq: ['Targa, VIN, modeli, viti', 'Datat e regjistrimit, sigurimit, inspektimit', 'Caktimi i personit përgjegjës', 'Import masiv nga CSV'],
      tr: ['Plaka, VIN, model, yıl', 'Kayıt, sigorta, muayene tarihleri', 'Sorumlu kişi atama', 'CSV toplu içe aktarma'],
      sr: ['Таблица, VIN, модел, година', 'Датуми регистрације, осигурања, прегледа', 'Додела одговорне особе', 'Масовни увоз из CSV']
    },
    step2Title: { en: 'Track Everything', mk: 'Следете сè', sq: 'Ndiqni gjithçka', tr: 'Her Şeyi Takip Et', sr: 'Пратите све' },
    step2Desc: { 
      en: 'Visual dashboard shows status of all vehicles at a glance. Filter, search, and sort to find what you need instantly.',
      mk: 'Визуелната табла прикажува статус на сите возила на еден поглед. Филтрирајте, пребарувајте и сортирајте.',
      sq: 'Paneli vizual tregon statusin e të gjitha automjeteve me një shikim. Filtro, kërko dhe rendit për të gjetur menjëherë.',
      tr: 'Görsel panel tüm araçların durumunu bir bakışta gösterir. Anında bulmak için filtreleyin, arayın ve sıralayın.',
      sr: 'Визуелна табла приказује статус свих возила на први поглед. Филтрирајте, претражујте и сортирајте.'
    },
    step2Features: {
      en: ['Color-coded status indicators', 'Smart search across all fields', 'Filter by status or vehicle type', 'Export to CSV, Excel, PDF'],
      mk: ['Статус индикатори во боја', 'Паметно пребарување низ сите полиња', 'Филтрирај по статус или тип', 'Извези во CSV, Excel, PDF'],
      sq: ['Tregues statusi me ngjyra', 'Kërkim i zgjuar në të gjitha fushat', 'Filtro sipas statusit ose tipit', 'Eksporto në CSV, Excel, PDF'],
      tr: ['Renkli durum göstergeleri', 'Tüm alanlarda akıllı arama', 'Durum veya tipe göre filtrele', 'CSV, Excel, PDF\'e aktar'],
      sr: ['Индикатори статуса у боји', 'Паметна претрага кроз сва поља', 'Филтрирај по статусу или типу', 'Извези у CSV, Excel, PDF']
    },
    step3Title: { en: 'Never Miss a Date', mk: 'Никогаш не пропуштајте', sq: 'Mos humbisni asnjë datë', tr: 'Tarihi Kaçırmayın', sr: 'Никад не пропустите' },
    step3Desc: { 
      en: 'Automatic email reminders ensure you never miss an expiry. Get notified well in advance to take action.',
      mk: 'Автоматски е-пошта потсетници обезбедуваат никогаш да не пропуштите истекување. Бидете известени однапред.',
      sq: 'Kujtesat automatike me email sigurojnë që të mos humbisni asnjë skadim. Merrni njoftim paraprakisht.',
      tr: 'Otomatik e-posta hatırlatıcıları hiçbir son kullanma tarihini kaçırmamanızı sağlar. Önceden bilgilendirilirsiniz.',
      sr: 'Аутоматски подсетници путем е-поште обезбеђују да никад не пропустите истек. Будите обавештени унапред.'
    },
    step3Features: {
      en: ['30 days before expiry', '7 days before expiry', '1 day before expiry', 'Customizable reminder schedule'],
      mk: ['30 дена пред истекување', '7 дена пред истекување', '1 ден пред истекување', 'Прилагодлив распоред'],
      sq: ['30 ditë para skadimit', '7 ditë para skadimit', '1 ditë para skadimit', 'Orar kujtesash i personalizueshëm'],
      tr: ['Son kullanmadan 30 gün önce', 'Son kullanmadan 7 gün önce', 'Son kullanmadan 1 gün önce', 'Özelleştirilebilir hatırlatıcı'],
      sr: ['30 дана пре истека', '7 дана пре истека', '1 дан пре истека', 'Прилагодљив распоред']
    },
    everythingTitle: { en: 'Everything you need in one place', mk: 'Сè што ви треба на едно место', sq: 'Gjithçka që ju nevojitet në një vend', tr: 'İhtiyacınız olan her şey tek bir yerde', sr: 'Све што вам треба на једном месту' },
    everythingDesc: { en: 'Designed for simplicity and efficiency', mk: 'Дизајнирано за едноставност и ефикасност', sq: 'Projektuar për thjeshtësi dhe efikasitet', tr: 'Basitlik ve verimlilik için tasarlandı', sr: 'Дизајнирано за једноставност и ефикасност' },
    feat1Title: { en: 'Automatic Reminders', mk: 'Автоматски потсетници', sq: 'Kujtesa automatike', tr: 'Otomatik Hatırlatıcılar', sr: 'Аутоматски подсетници' },
    feat1Desc: { 
      en: 'Reminders 30, 7, and 1 day before expiry. Never miss a registration again.',
      mk: 'Потсетници 30, 7 и 1 ден пред истек. Никогаш повеќе не пропуштајте регистрација.',
      sq: 'Kujtesa 30, 7 dhe 1 ditë para skadimit. Mos humbisni më kurrë një regjistrim.',
      tr: 'Son kullanma tarihinden 30, 7 ve 1 gün önce hatırlatıcılar. Bir daha asla kayıt kaçırmayın.',
      sr: 'Подсетници 30, 7 и 1 дан пре истека. Никада више не пропустите регистрацију.'
    },
    feat2Title: { en: 'Dashboard View', mk: 'Контролна табла', sq: 'Paneli kryesor', tr: 'Kontrol Paneli', sr: 'Контролна табла' },
    feat2Desc: { 
      en: 'Visual overview of all vehicles and their status at a glance.',
      mk: 'Визуелен преглед на сите возила и нивниот статус на еден поглед.',
      sq: 'Përmbledhje vizuale e të gjitha automjeteve dhe statusit të tyre.',
      tr: 'Tüm araçların ve durumlarının görsel özeti.',
      sr: 'Визуелни преглед свих возила и њиховог статуса на једном месту.'
    },
    feat3Title: { en: 'CSV Import', mk: 'CSV увоз', sq: 'Importi CSV', tr: 'CSV İçe Aktar', sr: 'CSV увоз' },
    feat3Desc: { 
      en: 'Quickly add multiple vehicles at once. Simple import from Excel.',
      mk: 'Брзо додајте повеќе возила одеднаш. Едноставен увоз од Excel.',
      sq: 'Shtoni shpejt shumë automjete menjëherë. Import i thjeshtë nga Excel.',
      tr: 'Aynı anda birden fazla araç ekleyin. Excel\'den basit içe aktarma.',
      sr: 'Брзо додајте више возила одједном. Једноставан увоз из Excel-а.'
    },
    feat4Title: { en: 'Multiple Users', mk: 'Повеќе корисници', sq: 'Përdorues të shumtë', tr: 'Çoklu Kullanıcı', sr: 'Више корисника' },
    feat4Desc: { 
      en: 'Manage fleet vehicles as a company. Add colleagues as users.',
      mk: 'Управувајте со возила на фирма. Додајте колеги како корисници.',
      sq: 'Menaxhoni automjetet e flotës si kompani. Shtoni kolegët si përdorues.',
      tr: 'Filo araçlarını şirket olarak yönetin. Meslektaşlarınızı kullanıcı olarak ekleyin.',
      sr: 'Управљајте возилима флоте као компанија. Додајте колеге као кориснике.'
    },
    feat5Title: { en: 'Email Notifications', mk: 'Е-пошта известувања', sq: 'Njoftimet me email', tr: 'E-posta Bildirimleri', sr: 'Е-пошта обавештења' },
    feat5Desc: { 
      en: 'Reliable email notifications directly to your inbox. Simple and secure.',
      mk: 'Сигурни е-пошта известувања директно во вашето сандаче. Едноставно и сигурно.',
      sq: 'Njoftime të besueshme me email direkt në kutinë tuaj. E thjeshtë dhe e sigurt.',
      tr: 'Doğrudan gelen kutunuza güvenilir e-posta bildirimleri. Basit ve güvenli.',
      sr: 'Поуздана обавештења путем е-поште директно у ваше сандуче. Једноставно и сигурно.'
    },
    feat6Title: { en: 'Mobile Access', mk: 'Мобилен пристап', sq: 'Qasje mobile', tr: 'Mobil Erişim', sr: 'Мобилни приступ' },
    feat6Desc: { 
      en: 'Access from any device. Responsive design for phones and tablets.',
      mk: 'Пристап од било кој уред. Респонзивен дизајн за телефони и таблети.',
      sq: 'Qasje nga çdo pajisje. Dizajn responsiv për telefona dhe tableta.',
      tr: 'Herhangi bir cihazdan erişim. Telefonlar ve tabletler için duyarlı tasarım.',
      sr: 'Приступ са било ког уређаја. Респонзивни дизајн за телефоне и таблете.'
    },
    ctaTitle: { en: 'Ready for a change?', mk: 'Спремни за промена?', sq: 'Gati për ndryshim?', tr: 'Değişime hazır mısınız?', sr: 'Спремни за промену?' },
    ctaDesc: { 
      en: 'Sign up and try VozenPark.mk free for 14 days.',
      mk: 'Регистрирајте се и пробајте VozenPark.mk бесплатно 14 дена.',
      sq: 'Regjistrohuni dhe provoni VozenPark.mk falas për 14 ditë.',
      tr: 'Kaydolun ve VozenPark.mk\'ı 14 gün ücretsiz deneyin.',
      sr: 'Региструјте се и пробајте VozenPark.mk бесплатно 14 дана.'
    },
    home: { en: 'Home', mk: 'Почетна', sq: 'Ballina', tr: 'Ana Sayfa', sr: 'Почетна' },
    demo: { en: 'Demo', mk: 'Демо', sq: 'Demo', tr: 'Demo', sr: 'Демо' },
    pricing: { en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' },
    privacy: { en: 'Privacy Policy', mk: 'Приватност', sq: 'Privatësia', tr: 'Gizlilik', sr: 'Приватност' },
    allRights: { en: 'All rights reserved.', mk: 'Сите права задржани.', sq: 'Të gjitha të drejtat e rezervuara.', tr: 'Tüm hakları saklıdır.', sr: 'Сва права задржана.' },
  };

  const pt = (key: string) => pageText[key]?.[language] || pageText[key]?.['en'] || key;

  const processSteps = [
    { icon: AddOutlined, title: pt('step1Title'), desc: pt('step1Desc'), features: pageText.step1Features?.[language] || pageText.step1Features?.['en'] || [] },
    { icon: CalendarMonthOutlined, title: pt('step2Title'), desc: pt('step2Desc'), features: pageText.step2Features?.[language] || pageText.step2Features?.['en'] || [] },
    { icon: EmailOutlined, title: pt('step3Title'), desc: pt('step3Desc'), features: pageText.step3Features?.[language] || pageText.step3Features?.['en'] || [] },
  ];

  const features = [
    { icon: NotificationsActiveOutlined, title: pt('feat1Title'), desc: pt('feat1Desc') },
    { icon: DashboardOutlined, title: pt('feat2Title'), desc: pt('feat2Desc') },
    { icon: UploadOutlined, title: pt('feat3Title'), desc: pt('feat3Desc') },
    { icon: GroupsOutlined, title: pt('feat4Title'), desc: pt('feat4Desc') },
    { icon: EmailOutlined, title: pt('feat5Title'), desc: pt('feat5Desc') },
    { icon: PhoneIphoneOutlined, title: pt('feat6Title'), desc: pt('feat6Desc') },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
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
          <Stack direction="row" alignItems="center" spacing={0.75}>
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
          </Stack>
          <Box sx={{ flex: 1 }} />
          
          {/* Desktop Navigation */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Language Selector */}
            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDownOutlined sx={{ fontSize: 16 }} />}
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                minWidth: 'auto',
                px: 1.5,
                fontSize: '0.875rem',
              }}
            >
              {language.toUpperCase()}
            </Button>
            {/* Divider */}
            <Typography sx={{ color: 'divider' }}>|</Typography>
            {/* Pricing Link */}
            <Button 
              component={Link} 
              href="/pricing" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
                minWidth: 'auto',
                px: 1.5,
              }}
            >
              {pt('pricing')}
            </Button>
            {/* Sign In Button */}
            <Button 
              component={Link} 
              href="/login" 
              variant="contained"
              sx={{ 
                fontWeight: 500,
                fontSize: '0.875rem',
                borderRadius: 20,
                px: 2.5,
                py: 1,
              }}
            >
              {t.common.login}
            </Button>
          </Stack>

          {/* Mobile Hamburger Menu */}
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { xs: 'flex', md: 'none' } }}
            aria-label="Open menu"
          >
            <MenuOutlined />
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
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          
          {/* Navigation Links */}
          <List sx={{ flex: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/pricing"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={pt('pricing')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/demo"
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={pt('demo')} />
              </ListItemButton>
            </ListItem>
          </List>

          {/* Sign In Button */}
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

          {/* Language Selector at bottom */}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, px: 1 }}>
            {pt('language') || 'Language'}
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

      {/* Hero Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left side - Text content */}
            <Grid size={{ xs: 12, md: 5 }}>
              {/* Badge with subtle star pulse */}
              <Box sx={{ mb: 3 }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [1, 0.9, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ display: 'inline-block' }}
                >
                  <Chip
                    label={pt('freeTrial')}
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      height: 32,
                      borderRadius: '16px', 
                      px: 0.5,
                      fontWeight: 500,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                      '& .MuiChip-label': { px: 1.5 },
                    }}
                  />
                </motion.div>
              </Box>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    fontWeight: 400,
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  {pt('heroLine1')}
                  <br />
                  <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                    {pt('heroLine2')}
                  </Box>
                </Typography>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.8, maxWidth: 400 }}
                >
                  {pt('heroDesc')}
                </Typography>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button
                      component={Link}
                      href="/signup"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardOutlined />}
                      sx={{ 
                        py: { xs: 1, sm: 1.5 }, 
                        px: { xs: 2.5, sm: 4 }, 
                        borderRadius: 20,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': {
                          boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
                        },
                      }}
                    >
                      {pt('getStarted')}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Button
                      component={Link}
                      href="/demo"
                      variant="outlined"
                      size="large"
                      sx={{ 
                        py: { xs: 1, sm: 1.5 }, 
                        px: { xs: 2.5, sm: 4 }, 
                        borderRadius: 20, 
                        textTransform: 'none', 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {pt('tryDemo')}
                    </Button>
                  </motion.div>
                </Stack>
              </motion.div>
            </Grid>

            {/* Right side - Dashboard Preview with perspective */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ overflow: 'visible', maxWidth: '100%' }}>
              <Box sx={{ overflow: 'visible', mx: { xs: -2, sm: 0 }, pb: 4 }}>
                <InteractiveDashboardPreview language={language} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: 10, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" textAlign="center" fontWeight={500} sx={{ mb: 1 }}>
              {pt('howItWorks')}
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}>
              {pt('howItWorksDesc')}
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {processSteps.map((step, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <ProcessStep
                  number={i + 1}
                  title={step.title}
                  description={step.desc}
                  icon={step.icon}
                  delay={i * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: 10, bgcolor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" textAlign="center" fontWeight={500} sx={{ mb: 1 }}>
              {pt('everythingTitle')}
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              {pt('everythingDesc')}
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {features.map((feature, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                  delay={i * 0.05}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative logo symbols */}
        <Box
          component="img"
          src="/VozenPark_logo.svg"
          alt=""
          sx={{
            position: 'absolute',
            top: -80,
            left: -100,
            width: 320,
            height: 320,
            opacity: 0.08,
            filter: 'brightness(0) invert(1)',
          }}
        />
        <Box
          component="img"
          src="/VozenPark_logo.svg"
          alt=""
          sx={{
            position: 'absolute',
            bottom: -100,
            right: -80,
            width: 400,
            height: 400,
            opacity: 0.06,
            filter: 'brightness(0) invert(1)',
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" textAlign="center" fontWeight={500} color="white" sx={{ mb: 2 }}>
              {pt('ctaTitle')}
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ color: alpha('#fff', 0.8), mb: 4 }}>
              {pt('ctaDesc')}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardOutlined />}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: '#fff',
                  color: 'primary.main',
                  borderRadius: 20,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.9)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {pt('getStarted')}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#FFFFFF', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <Box
                  component="img"
                  src="/VozenPark_logo.svg"
                  alt="VozenPark"
                  sx={{ height: 20 }}
                />
                <Typography variant="body1" fontWeight={500} color="text.primary" sx={{ lineHeight: 1 }}>
                  VozenPark.mk
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" color="text.secondary" component={Link} href="/" sx={{ textDecoration: 'none' }}>
                {pt('home')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/pricing" sx={{ textDecoration: 'none' }}>
                {pt('pricing')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/demo" sx={{ textDecoration: 'none' }}>
                {pt('demo')}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/login" sx={{ textDecoration: 'none' }}>
                {t.common.login}
              </Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/privacy" sx={{ textDecoration: 'none' }}>
                {pt('privacy')}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} VozenPark. {pt('allRights')}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: '12px', mt: 1 } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === language}
          >
            <span style={{ marginRight: 12, fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>{lang.flag}</span>
            {lang.name}
            {lang.code === language && <CheckOutlined sx={{ ml: 2, fontSize: 18 }} />}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
