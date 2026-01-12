'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Stack, Box, alpha, useTheme } from '@mui/material';
import { Warning, Schedule, CheckCircle } from '@mui/icons-material';
import type { Language } from '@/types';
import { getTranslations } from '@/lib/i18n';

interface StatusCardProps {
  type: 'urgent' | 'soon' | 'ok';
  count: number;
  language: Language;
}

export function StatusCard({ type, count, language }: StatusCardProps) {
  const theme = useTheme();
  const t = getTranslations(language);

  const config = {
    urgent: {
      icon: Warning,
      label: t.status.urgent,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.08),
    },
    soon: {
      icon: Schedule,
      label: t.status.dueSoon,
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.08),
    },
    ok: {
      icon: CheckCircle,
      label: t.status.ok,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.08),
    },
  };

  const { icon: Icon, label, color, bgColor } = config[type];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card
        sx={{
          bgcolor: bgColor,
          border: `1px solid ${alpha(color, 0.2)}`,
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 30px ${alpha(color, 0.2)}`,
          },
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(color, 0.15),
                }}
              >
                <Icon sx={{ color, fontSize: 24 }} />
              </Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color }}>
                {label}
              </Typography>
            </Stack>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Typography variant="h3" fontWeight={700} sx={{ color }}>
                {count}
              </Typography>
            </motion.div>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatusCardsProps {
  urgent: number;
  soon: number;
  ok: number;
  language: Language;
}

export function StatusCards({ urgent, soon, ok, language }: StatusCardsProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
      <StatusCard type="urgent" count={urgent} language={language} />
      <StatusCard type="soon" count={soon} language={language} />
      <StatusCard type="ok" count={ok} language={language} />
    </Box>
  );
}
