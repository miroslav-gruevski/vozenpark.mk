'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  alpha,
  useTheme,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  DirectionsCar,
  Edit,
  Delete,
  MoreVert,
  CalendarMonth,
  Security,
  Build,
  Add,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { getTranslations } from '@/lib/i18n';
import { deleteVehicle } from '@/lib/api';
import { formatDate, getDaysUntil, getMinExpiryStatus } from '@/lib/dates';
import type { Language, Vehicle, ExpiryStatus } from '@/types';

interface VehicleTableProps {
  vehicles: Vehicle[];
  language: Language;
}

export function VehicleTable({ vehicles, language }: VehicleTableProps) {
  const router = useRouter();
  const theme = useTheme();
  const t = getTranslations(language);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicleId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicleId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.common.confirmDelete)) return;

    try {
      setDeletingId(id);
      handleMenuClose();
      await deleteVehicle(id);
      toast.success(t.common.success);
      router.refresh();
    } catch {
      toast.error(t.errors.somethingWentWrong);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: ExpiryStatus) => {
    switch (status) {
      case 'expired':
      case 'urgent':
        return theme.palette.error.main;
      case 'soon':
        return theme.palette.warning.main;
      case 'ok':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: ExpiryStatus) => {
    switch (status) {
      case 'expired':
        return t.status.expired;
      case 'urgent':
        return t.status.urgent;
      case 'soon':
        return t.status.dueSoon;
      case 'ok':
        return t.status.ok;
      default:
        return '';
    }
  };

  if (vehicles.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 8, px: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <DirectionsCar sx={{ fontSize: 40, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {t.common.noVehicles}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {t.vehicles.noVehicles}
          </Typography>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              component={Link}
              href="/vehicles/new"
              variant="contained"
              startIcon={<Add />}
              size="large"
            >
              {t.vehicles.addNew}
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <AnimatePresence>
        {vehicles.map((vehicle, index) => {
          const minExpiry = getMinExpiryStatus(
            new Date(vehicle.regExpiry),
            new Date(vehicle.insExpiry),
            new Date(vehicle.inspExpiry)
          );
          const statusColor = getStatusColor(minExpiry.status);
          const isDeleting = deletingId === vehicle.id;

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card
                sx={{
                  borderLeft: `4px solid ${statusColor}`,
                  opacity: isDeleting ? 0.5 : 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 8px 30px ${alpha(statusColor, 0.15)}`,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    spacing={2}
                  >
                    {/* Vehicle Info */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(statusColor, 0.1) }}>
                        <DirectionsCar sx={{ color: statusColor }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {vehicle.plate}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${minExpiry.daysUntil <= 0 ? t.common.expired : `${minExpiry.daysUntil} ${t.common.daysLeft}`}`}
                          sx={{
                            bgcolor: alpha(statusColor, 0.1),
                            color: statusColor,
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Dates - Desktop */}
                    <Stack
                      direction="row"
                      spacing={4}
                      sx={{ display: { xs: 'none', md: 'flex' }, flex: 2 }}
                    >
                      {[
                        { icon: CalendarMonth, label: t.vehicles.registration, date: vehicle.regExpiry },
                        { icon: Security, label: t.vehicles.insurance, date: vehicle.insExpiry },
                        { icon: Build, label: t.vehicles.inspection, date: vehicle.inspExpiry },
                      ].map((item, i) => {
                        const days = getDaysUntil(item.date);
                        const status: ExpiryStatus = days <= 0 ? 'expired' : days <= 7 ? 'urgent' : days <= 30 ? 'soon' : 'ok';
                        const color = getStatusColor(status);

                        return (
                          <Box key={i} sx={{ minWidth: 120 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                              <item.icon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {item.label}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDate(item.date)}
                            </Typography>
                            <Chip
                              size="small"
                              label={getStatusLabel(status)}
                              sx={{
                                bgcolor: alpha(color, 0.1),
                                color: color,
                                fontWeight: 600,
                                fontSize: 11,
                                height: 20,
                                mt: 0.5,
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={t.common.edit}>
                        <IconButton
                          component={Link}
                          href={`/vehicles/${vehicle.id}/edit`}
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                            },
                          }}
                        >
                          <Edit sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t.common.delete}>
                        <IconButton
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={isDeleting}
                          sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.15),
                            },
                          }}
                        >
                          {isDeleting ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Delete sx={{ fontSize: 20, color: 'error.main' }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {/* Dates - Mobile */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ display: { xs: 'flex', md: 'none' }, mt: 2, flexWrap: 'wrap', gap: 1 }}
                  >
                    {[
                      { label: t.vehicles.registration, date: vehicle.regExpiry },
                      { label: t.vehicles.insurance, date: vehicle.insExpiry },
                      { label: t.vehicles.inspection, date: vehicle.inspExpiry },
                    ].map((item, i) => {
                      const days = getDaysUntil(item.date);
                      const status: ExpiryStatus = days <= 0 ? 'expired' : days <= 7 ? 'urgent' : days <= 30 ? 'soon' : 'ok';
                      const color = getStatusColor(status);

                      return (
                        <Box key={i} sx={{ minWidth: 100 }}>
                          <Typography variant="caption" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDate(item.date)}
                          </Typography>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, mt: 0.5 }} />
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Stack>
  );
}
