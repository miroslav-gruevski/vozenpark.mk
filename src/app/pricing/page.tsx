'use client';

import { useState, useEffect } from 'react';
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
  Switch,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CheckOutlined,
  CloseOutlined,
  ExpandMoreOutlined,
  ArrowForwardOutlined,
  AccessTimeOutlined,
} from '@mui/icons-material';
import { Header } from '@/components/Header';
import { getLanguageFromStorage, setLanguageToStorage } from '@/lib/i18n';
import type { Language } from '@/types';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

// Translations
const translations = {
  pageTitle: {
    en: 'Simple and transparent pricing',
    mk: 'Едноставни и транспарентни цени',
    sq: 'Çmime të thjeshta dhe transparente',
    tr: 'Basit ve şeffaf fiyatlandırma',
    sr: 'Једноставне и транспарентне цене',
  },
  pageSubtitle: {
    en: '14 days free trial. No credit card required.',
    mk: '14 дена бесплатен пробен период. Без кредитна картичка.',
    sq: '14 ditë provë falas. Pa kartë krediti.',
    tr: '14 gün ücretsiz deneme. Kredi kartı gerekmez.',
    sr: '14 дана бесплатног пробног периода. Без кредитне картице.',
  },
  monthly: {
    en: 'Monthly',
    mk: 'Месечно',
    sq: 'Mujore',
    tr: 'Aylık',
    sr: 'Месечно',
  },
  yearly: {
    en: 'Yearly',
    mk: 'Годишно',
    sq: 'Vjetore',
    tr: 'Yıllık',
    sr: 'Годишње',
  },
  twoMonthsFree: {
    en: '2 months free',
    mk: '2 месеци гратис',
    sq: '2 muaj falas',
    tr: '2 ay ücretsiz',
    sr: '2 месеца гратис',
  },
  mostPopular: {
    en: 'Most popular',
    mk: 'Најпопуларен',
    sq: 'Më i popullarizuari',
    tr: 'En popüler',
    sr: 'Најпопуларнији',
  },
  perMonth: {
    en: '/month',
    mk: '/месечно',
    sq: '/muaj',
    tr: '/ay',
    sr: '/месечно',
  },
  perYear: {
    en: '/year',
    mk: '/годишно',
    sq: '/vit',
    tr: '/yıl',
    sr: '/годишње',
  },
  saveYearly: {
    en: 'Save',
    mk: 'Заштеда',
    sq: 'Kurseni',
    tr: 'Tasarruf',
    sr: 'Уштеда',
  },
  yearlyText: {
    en: 'yearly',
    mk: 'годишно',
    sq: 'në vit',
    tr: 'yıllık',
    sr: 'годишње',
  },
  requestAccess: {
    en: 'Request access',
    mk: 'Побарај пристап',
    sq: 'Kërkoni qasje',
    tr: 'Erişim isteyin',
    sr: 'Затражите приступ',
  },
  // Plans
  starter: {
    name: { en: 'Starter', mk: 'Стартер', sq: 'Fillestar', tr: 'Başlangıç', sr: 'Стартер' },
    description: { en: 'For small businesses', mk: 'За мали фирми и претприемачи', sq: 'Për biznese të vogla', tr: 'Küçük işletmeler için', sr: 'За мале фирме' },
    price: 990,
  },
  pro: {
    name: { en: 'Pro', mk: 'Про', sq: 'Pro', tr: 'Pro', sr: 'Про' },
    description: { en: 'For medium companies', mk: 'За средни фирми', sq: 'Për kompani të mesme', tr: 'Orta ölçekli şirketler için', sr: 'За средње фирме' },
    price: 2490,
  },
  business: {
    name: { en: 'Business', mk: 'Бизнис', sq: 'Biznes', tr: 'İşletme', sr: 'Бизнис' },
    description: { en: 'For large fleets', mk: 'За големи флоти', sq: 'Për flota të mëdha', tr: 'Büyük filolar için', sr: 'За велике флоте' },
    price: 5490,
  },
  // Features
  features: {
    vehicles: { en: 'Vehicles', mk: 'Возила', sq: 'Automjete', tr: 'Araç', sr: 'Возила' },
    users: { en: 'Users', mk: 'Корисници', sq: 'Përdorues', tr: 'Kullanıcı', sr: 'Корисници' },
    emailReminders: { en: 'Email reminders (30/7/1 days)', mk: 'Е-маил потсетници (30/7/1 ден)', sq: 'Kujtesa me email (30/7/1 ditë)', tr: 'E-posta hatırlatıcıları (30/7/1 gün)', sr: 'Е-маил подсетници (30/7/1 дан)' },
    calendarView: { en: 'Calendar view', mk: 'Календар преглед', sq: 'Pamje kalendari', tr: 'Takvim görünümü', sr: 'Календар преглед' },
    csvImportExport: { en: 'CSV Import/Export', mk: 'CSV Увоз/Извоз', sq: 'Import/Eksport CSV', tr: 'CSV İçe/Dışa Aktarma', sr: 'CSV Увоз/Извоз' },
    companyAccount: { en: 'Company account', mk: 'Компаниска сметка', sq: 'Llogari kompanie', tr: 'Şirket hesabı', sr: 'Компанијски налог' },
    mobileAccess: { en: 'Mobile access', mk: 'Мобилен пристап', sq: 'Qasje mobile', tr: 'Mobil erişim', sr: 'Мобилни приступ' },
    prioritySupport: { en: 'Priority support', mk: 'Приоритетна поддршка', sq: 'Mbështetje prioritare', tr: 'Öncelikli destek', sr: 'Приоритетна подршка' },
    dedicatedManager: { en: 'Dedicated account manager', mk: 'Дедициран менаџер', sq: 'Menaxher i dedikuar', tr: 'Özel hesap yöneticisi', sr: 'Дедицирани менаџер' },
    upTo: { en: 'Up to', mk: 'До', sq: 'Deri në', tr: 'Kadar', sr: 'До' },
    unlimited: { en: 'Unlimited', mk: 'Неограничено', sq: 'Pa limit', tr: 'Sınırsız', sr: 'Неограничено' },
  },
  // CTA Section
  ctaTitle: {
    en: 'Try VozenPark.mk risk-free',
    mk: 'Испробајте ја VozenPark.mk без ризик',
    sq: 'Provoni VozenPark.mk pa rrezik',
    tr: 'VozenPark.mk\'ı risksiz deneyin',
    sr: 'Испробајте VozenPark.mk без ризика',
  },
  ctaSubtitle: {
    en: 'All features available during trial. No credit card. Cancel anytime.',
    mk: 'Сите функции достапни за време на пробниот период. Без кредитна картичка. Откажете било кога.',
    sq: 'Të gjitha veçoritë në dispozicion gjatë provës. Pa kartë krediti. Anuloni në çdo kohë.',
    tr: 'Deneme süresi boyunca tüm özellikler kullanılabilir. Kredi kartı yok. İstediğiniz zaman iptal edin.',
    sr: 'Све функције доступне током пробног периода. Без кредитне картице. Откажите било када.',
  },
  freeDays: {
    en: '14 days free',
    mk: '14 дена бесплатно',
    sq: '14 ditë falas',
    tr: '14 gün ücretsiz',
    sr: '14 дана бесплатно',
  },
  // Comparison
  planComparison: {
    en: 'Plan comparison',
    mk: 'Споредба на планови',
    sq: 'Krahasimi i planeve',
    tr: 'Plan karşılaştırması',
    sr: 'Поређење планова',
  },
  feature: {
    en: 'Feature',
    mk: 'Функција',
    sq: 'Veçori',
    tr: 'Özellik',
    sr: 'Функција',
  },
  // FAQ
  faq: {
    title: {
      en: 'Frequently asked questions',
      mk: 'Често поставувани прашања',
      sq: 'Pyetje të shpeshta',
      tr: 'Sık sorulan sorular',
      sr: 'Често постављана питања',
    },
    questions: [
      {
        q: { en: 'How does the free trial work?', mk: 'Како функционира бесплатниот пробен период?', sq: 'Si funksionon prova falas?', tr: 'Ücretsiz deneme nasıl çalışır?', sr: 'Како функционише бесплатни пробни период?' },
        a: { en: 'You get 14 days of full access to all features without restrictions. No credit card required to start. At the end of the trial, you can choose the plan that suits you.', mk: 'Добивате 14 дена пристап до сите функции без ограничувања. Не требате кредитна картичка за почеток. На крајот од пробниот период можете одберете план кој ви одговара.', sq: 'Merrni 14 ditë qasje të plotë në të gjitha veçoritë pa kufizime. Nuk nevojitet kartë krediti për të filluar. Në fund të provës mund të zgjidhni planin që ju përshtatet.', tr: '14 gün boyunca tüm özelliklere tam erişim elde edersiniz. Başlamak için kredi kartı gerekmez. Deneme süresinin sonunda size uygun planı seçebilirsiniz.', sr: 'Добијате 14 дана пуног приступа свим функцијама без ограничења. Није потребна кредитна картица за почетак. На крају пробног периода можете одабрати план који вам одговара.' },
      },
      {
        q: { en: 'Can I change my plan later?', mk: 'Можам ли да го променам планот подоцна?', sq: 'A mund ta ndryshoj planin më vonë?', tr: 'Planımı daha sonra değiştirebilir miyim?', sr: 'Могу ли касније да променим план?' },
        a: { en: 'Yes, you can upgrade or downgrade your plan at any time. The change takes effect immediately, and the price is proportionally adjusted.', mk: 'Да, можете надоградите или смањите план било када. Промјената стапува на снага одмах, а цената се пропорционално прилагодува.', sq: 'Po, mund të përmirësoni ose ulni planin tuaj në çdo kohë. Ndryshimi hyn në fuqi menjëherë dhe çmimi përshtatet proporcionalisht.', tr: 'Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklik hemen yürürlüğe girer ve fiyat orantılı olarak ayarlanır.', sr: 'Да, можете надоградити или смањити план у било ком тренутку. Промена ступа на снагу одмах, а цена се пропорционално прилагођава.' },
      },
      {
        q: { en: 'What payment methods are supported?', mk: 'Кои начини на плаќање се поддржани?', sq: 'Cilat mënyra pagese mbështeten?', tr: 'Hangi ödeme yöntemleri destekleniyor?', sr: 'Који начини плаћања су подржани?' },
        a: { en: 'We accept payment via invoice for monthly and yearly plans.', mk: 'Прифаќаме плаќање преку фактура за месечни и годишни планови.', sq: 'Pranojmë pagesë me faturë për planet mujore dhe vjetore.', tr: 'Aylık ve yıllık planlar için fatura ile ödeme kabul ediyoruz.', sr: 'Прихватамо плаћање путем фактуре за месечне и годишње планове.' },
      },
      {
        q: { en: 'What happens if I exceed the vehicle limit?', mk: 'Што се случува ако го надминам лимитот на возила?', sq: 'Çfarë ndodh nëse e tejkaloj limitin e automjeteve?', tr: 'Araç limitini aşarsam ne olur?', sr: 'Шта се дешава ако прекорачим лимит возила?' },
        a: { en: 'You won\'t be able to add new vehicles until you upgrade your plan or remove existing vehicles. All existing data and reminders remain active.', mk: 'Нема да можете да додавате нови возила додека не го надоградите планот или не отстраните постоечки возила. Сите постоечки податоци и потсетници остануваат активни.', sq: 'Nuk do të mund të shtoni automjete të reja derisa të përmirësoni planin ose të hiqni automjetet ekzistuese. Të gjitha të dhënat dhe kujtesat ekzistuese mbeten aktive.', tr: 'Planınızı yükseltene veya mevcut araçları kaldırana kadar yeni araç ekleyemezsiniz. Tüm mevcut veriler ve hatırlatıcılar aktif kalır.', sr: 'Нећете моћи додавати нова возила док не надоградите план или уклоните постојећа возила. Сви постојећи подаци и подсетници остају активни.' },
      },
      {
        q: { en: 'How can I cancel my subscription?', mk: 'Како можам да ја откажам претплатата?', sq: 'Si mund ta anuloj abonimin?', tr: 'Aboneliğimi nasıl iptal edebilirim?', sr: 'Како могу да откажем претплату?' },
        a: { en: 'You can cancel anytime from account settings. After cancellation, access remains active until the end of the paid period.', mk: 'Можете да откажете било кога од поставки на сметката. По откажување, пристапот останува активен до крајот на платениот период.', sq: 'Mund të anuloni në çdo kohë nga cilësimet e llogarisë. Pas anulimit, qasja mbetet aktive deri në fund të periudhës së paguar.', tr: 'Hesap ayarlarından istediğiniz zaman iptal edebilirsiniz. İptalden sonra, ödenen dönemin sonuna kadar erişim aktif kalır.', sr: 'Можете отказати било када из подешавања налога. Након отказивања, приступ остаје активан до краја плаћеног периода.' },
      },
    ],
  },
};

// Plan features configuration
const planFeatures = {
  starter: {
    vehicles: 10,
    users: 2,
    emailReminders: true,
    calendarView: true,
    csvImportExport: true,
    companyAccount: true,
    mobileAccess: true,
    prioritySupport: false,
    dedicatedManager: false,
  },
  pro: {
    vehicles: 50,
    users: 5,
    emailReminders: true,
    calendarView: true,
    csvImportExport: true,
    companyAccount: true,
    mobileAccess: true,
    prioritySupport: true,
    dedicatedManager: false,
  },
  business: {
    vehicles: 'unlimited',
    users: 15,
    emailReminders: true,
    calendarView: true,
    csvImportExport: true,
    companyAccount: true,
    mobileAccess: true,
    prioritySupport: true,
    dedicatedManager: true,
  },
};

export default function PricingPage() {
  const theme = useTheme();
  const [language, setLanguage] = useState<Language>('mk');
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | false>(false);

  useEffect(() => {
    setLanguage(getLanguageFromStorage());
  }, []);

  const handleFaqChange = (panel: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setLanguageToStorage(lang);
  };

  const txt = (key: keyof typeof translations) => {
    const translation = translations[key];
    if (typeof translation === 'object' && 'en' in translation) {
      return translation[language] || translation.en;
    }
    return key;
  };

  const getPrice = (monthlyPrice: number) => {
    if (isYearly) {
      return Math.round(monthlyPrice * 10); // 10 months price for yearly (2 months free)
    }
    return monthlyPrice;
  };

  const getYearlySavings = (monthlyPrice: number) => {
    // Yearly = 10 months, so savings = 2 months worth
    return monthlyPrice * 2;
  };

  const renderFeatureValue = (value: boolean | number | string, feature: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckOutlined sx={{ color: 'success.main', fontSize: 20 }} />
      ) : (
        <CloseOutlined sx={{ color: 'text.disabled', fontSize: 20 }} />
      );
    }
    if (value === 'unlimited') {
      return translations.features.unlimited[language];
    }
    if (feature === 'vehicles' || feature === 'users') {
      return value.toString();
    }
    return value;
  };

  const featureKeys = [
    'vehicles',
    'users', 
    'emailReminders',
    'calendarView',
    'csvImportExport',
    'companyAccount',
    'mobileAccess',
    'prioritySupport',
    'dedicatedManager',
  ] as const;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header 
        language={language} 
        onLanguageChange={handleLanguageChange}
        isAuthenticated={false}
      />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          <motion.div variants={fadeInUp}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
              >
                {txt('pageTitle')}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                {txt('pageSubtitle')}
              </Typography>
            </Box>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div variants={fadeInUp} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: { xs: 1.5, sm: 2 }, 
              mb: 6,
            }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 25,
                  p: 0.5,
                  position: 'relative',
                }}
              >
                <Box
                  onClick={() => setIsYearly(false)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: !isYearly ? 'background.paper' : 'transparent',
                    boxShadow: !isYearly ? `0 2px 8px ${alpha('#000', 0.1)}` : 'none',
                    zIndex: 1,
                  }}
                >
                  <Typography 
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: !isYearly ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out',
                      userSelect: 'none',
                    }}
                  >
                    {txt('monthly')}
                  </Typography>
                </Box>
                <Box
                  onClick={() => setIsYearly(true)}
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    bgcolor: isYearly ? 'background.paper' : 'transparent',
                    boxShadow: isYearly ? `0 2px 8px ${alpha('#000', 0.1)}` : 'none',
                    zIndex: 1,
                  }}
                >
                  <Typography 
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: isYearly ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out',
                      userSelect: 'none',
                    }}
                  >
                    {txt('yearly')}
                  </Typography>
                </Box>
              </Box>
              {isYearly && (
                <Chip 
                  label={txt('twoMonthsFree')}
                  color="success"
                  size="small"
                  sx={{ 
                    height: 28,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    borderRadius: '14px',
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
              )}
            </Box>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div variants={fadeInUp}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems={{ xs: 'center', md: 'stretch' }}
              sx={{ overflow: 'visible', pt: 2 }}
            >
              {/* Starter */}
              <Card 
                sx={{ 
                  width: { xs: '100%', sm: 340 },
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha('#000', 0.08)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {translations.starter.name[language]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {translations.starter.description[language]}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h3" fontWeight={700}>
                        {getPrice(translations.starter.price).toLocaleString()}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
                        ден
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {isYearly ? txt('perYear') : txt('perMonth')}
                      </Typography>
                    </Box>
                    {isYearly && (
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500, mt: 0.5 }}>
                        {txt('saveYearly')} {getYearlySavings(translations.starter.price).toLocaleString()} ден {txt('yearlyText')}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    <FeatureItem text={`${translations.features.upTo[language]} 10 ${translations.features.vehicles[language].toLowerCase()}`} />
                    <FeatureItem text={`2 ${translations.features.users[language].toLowerCase()}`} />
                    <FeatureItem text={translations.features.emailReminders[language]} />
                    <FeatureItem text={translations.features.calendarView[language]} />
                    <FeatureItem text={translations.features.csvImportExport[language]} />
                    <FeatureItem text={translations.features.companyAccount[language]} />
                    <FeatureItem text={translations.features.mobileAccess[language]} />
                  </Stack>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    sx={{ borderRadius: 20, py: 1.5 }}
                  >
                    {txt('requestAccess')}
                  </Button>
                </CardContent>
              </Card>

              {/* Pro - Most Popular */}
              <Card 
                sx={{ 
                  width: { xs: '100%', sm: 340 },
                  borderRadius: 2,
                  border: `2px solid ${theme.palette.primary.main}`,
                  position: 'relative',
                  transform: { md: 'scale(1.05)' },
                  zIndex: 1,
                  overflow: 'visible',
                  background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}, 0 4px 16px ${alpha('#000', 0.05)}`,
                }}
              >
                <Chip 
                  label={txt('mostPopular')}
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: 28,
                    px: 0.5,
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    letterSpacing: '0.02em',
                    zIndex: 10,
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    borderRadius: '14px',
                    boxShadow: `0 3px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {translations.pro.name[language]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {translations.pro.description[language]}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h3" fontWeight={700} color="primary.main">
                        {getPrice(translations.pro.price).toLocaleString()}
                      </Typography>
                      <Typography variant="body1" color="primary.main" sx={{ ml: 0.5 }}>
                        ден
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {isYearly ? txt('perYear') : txt('perMonth')}
                      </Typography>
                    </Box>
                    {isYearly && (
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500, mt: 0.5 }}>
                        {txt('saveYearly')} {getYearlySavings(translations.pro.price).toLocaleString()} ден {txt('yearlyText')}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    <FeatureItem text={`${translations.features.upTo[language]} 50 ${translations.features.vehicles[language].toLowerCase()}`} />
                    <FeatureItem text={`5 ${translations.features.users[language].toLowerCase()}`} />
                    <FeatureItem text={translations.features.emailReminders[language]} />
                    <FeatureItem text={translations.features.calendarView[language]} />
                    <FeatureItem text={translations.features.csvImportExport[language]} />
                    <FeatureItem text={translations.features.companyAccount[language]} />
                    <FeatureItem text={translations.features.mobileAccess[language]} />
                    <FeatureItem text={translations.features.prioritySupport[language]} />
                  </Stack>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    sx={{ borderRadius: 20, py: 1.5 }}
                  >
                    {txt('requestAccess')}
                  </Button>
                </CardContent>
              </Card>

              {/* Business */}
              <Card 
                sx={{ 
                  width: { xs: '100%', sm: 340 },
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: `0 2px 12px ${alpha('#000', 0.04)}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha('#000', 0.08)}`,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {translations.business.name[language]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {translations.business.description[language]}
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                      <Typography variant="h3" fontWeight={700}>
                        {getPrice(translations.business.price).toLocaleString()}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 0.5 }}>
                        ден
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {isYearly ? txt('perYear') : txt('perMonth')}
                      </Typography>
                    </Box>
                    {isYearly && (
                      <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 500, mt: 0.5 }}>
                        {txt('saveYearly')} {getYearlySavings(translations.business.price).toLocaleString()} ден {txt('yearlyText')}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1.5} sx={{ mb: 4 }}>
                    <FeatureItem text={translations.features.unlimited[language] + ' ' + translations.features.vehicles[language].toLowerCase()} />
                    <FeatureItem text={`15 ${translations.features.users[language].toLowerCase()}`} />
                    <FeatureItem text={translations.features.emailReminders[language]} />
                    <FeatureItem text={translations.features.calendarView[language]} />
                    <FeatureItem text={translations.features.csvImportExport[language]} />
                    <FeatureItem text={translations.features.companyAccount[language]} />
                    <FeatureItem text={translations.features.mobileAccess[language]} />
                    <FeatureItem text={translations.features.prioritySupport[language]} />
                    <FeatureItem text={translations.features.dedicatedManager[language]} />
                  </Stack>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    sx={{ borderRadius: 20, py: 1.5 }}
                  >
                    {txt('requestAccess')}
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </motion.div>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: { xs: 6, md: 8 },
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
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip 
            icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
            label={txt('freeDays')}
            sx={{ 
              mb: 3,
              height: 32,
              px: 1,
              bgcolor: alpha('#fff', 0.2),
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '16px',
              border: `1px solid ${alpha('#fff', 0.3)}`,
              '& .MuiChip-icon': { color: '#fff' },
              '& .MuiChip-label': { px: 1 },
            }}
          />
          <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
            {txt('ctaTitle')}
          </Typography>
          <Typography variant="body1" color="white" sx={{ opacity: 0.9, mb: 4 }}>
            {txt('ctaSubtitle')}
          </Typography>
          <Button
            component={Link}
            href="/signup"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardOutlined />}
            sx={{
              background: '#fff',
              color: 'primary.main',
              borderRadius: 20,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              '&:hover': {
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              },
            }}
          >
            {txt('requestAccess')}
          </Button>
        </Container>
      </Box>

      {/* Comparison Table */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
          {txt('planComparison')}
        </Typography>
        <Box sx={{ mt: 4, overflowX: 'auto' }}>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.8)}`, borderRadius: 2, boxShadow: `0 2px 12px ${alpha('#000', 0.04)}` }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>{txt('feature')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{translations.starter.name[language]}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                    {translations.pro.name[language]}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>{translations.business.name[language]}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featureKeys.map((feature) => (
                  <TableRow key={feature} hover>
                    <TableCell>{translations.features[feature][language]}</TableCell>
                    <TableCell align="center">{renderFeatureValue(planFeatures.starter[feature], feature)}</TableCell>
                    <TableCell align="center" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                      {renderFeatureValue(planFeatures.pro[feature], feature)}
                    </TableCell>
                    <TableCell align="center">{renderFeatureValue(planFeatures.business[feature], feature)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom sx={{ mb: 5 }}>
            {translations.faq.title[language]}
          </Typography>
          <Stack spacing={2}>
            {translations.faq.questions.map((item, index) => (
              <Accordion 
                key={index}
                expanded={expandedFaq === index}
                onChange={handleFaqChange(index)}
                elevation={0}
                disableGutters
                sx={{ 
                  bgcolor: 'background.paper',
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  borderRadius: '16px !important',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease-in-out',
                  '&:before': { display: 'none' },
                  '&.Mui-expanded': { 
                    margin: 0,
                    borderColor: theme.palette.primary.main,
                  },
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                }}
              >
                <AccordionSummary 
                  expandIcon={
                    <Box 
                      sx={{ 
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: expandedFaq === index ? 'primary.main' : alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <ExpandMoreOutlined 
                        sx={{ 
                          fontSize: 20,
                          color: expandedFaq === index ? 'white' : 'primary.main',
                          transition: 'transform 0.3s ease-in-out',
                        }} 
                      />
                    </Box>
                  }
                  sx={{ 
                    px: 3,
                    py: 1,
                    minHeight: 64,
                    '&.Mui-expanded': { minHeight: 64 },
                    '& .MuiAccordionSummary-content': { 
                      margin: '16px 0',
                      '&.Mui-expanded': { margin: '16px 0' },
                    },
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                      transform: 'rotate(180deg)',
                    },
                  }}
                >
                  <Typography 
                    fontWeight={600} 
                    sx={{ 
                      color: expandedFaq === index ? 'primary.main' : 'text.primary',
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {item.q[language]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails 
                  sx={{ 
                    px: 3, 
                    pb: 3, 
                    pt: 0,
                  }}
                >
                  <Typography 
                    color="text.secondary" 
                    sx={{ 
                      lineHeight: 1.7,
                      pl: 0,
                    }}
                  >
                    {item.a[language]}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center"
            spacing={2}
          >
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
                <Box
                  component="img"
                  src="/VozenPark_logo.svg"
                  alt="VozenPark"
                  sx={{ height: 20 }}
                />
                <Typography variant="body2" color="text.secondary">
                  VozenPark.mk
                </Typography>
              </Stack>
            </Link>
            <Stack direction="row" spacing={3}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {{ en: 'Home', mk: 'Почетна', sq: 'Ballina', tr: 'Ana Sayfa', sr: 'Почетна' }[language]}
                </Typography>
              </Link>
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary.main" fontWeight={500}>
                  {{ en: 'Pricing', mk: 'Цени', sq: 'Çmimet', tr: 'Fiyatlar', sr: 'Цене' }[language]}
                </Typography>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {{ en: 'Login', mk: 'Најава', sq: 'Hyr', tr: 'Giriş', sr: 'Пријава' }[language]}
                </Typography>
              </Link>
              <Link href="/privacy" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {{ en: 'Privacy Policy', mk: 'Приватност', sq: 'Privatësia', tr: 'Gizlilik', sr: 'Приватност' }[language]}
                </Typography>
              </Link>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              © 2026 VozenPark. {{ en: 'All rights reserved.', mk: 'Сите права задржани.', sq: 'Të gjitha të drejtat e rezervuara.', tr: 'Tüm hakları saklıdır.', sr: 'Сва права задржана.' }[language]}
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

// Helper component for feature items
function FeatureItem({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckOutlined sx={{ color: 'success.main', fontSize: 18 }} />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}
