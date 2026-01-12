'use client';

import { Box, Typography, Button, alpha } from '@mui/material';
import { DirectionsCarOutlined, AddOutlined, SearchOffOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  variant?: 'no-vehicles' | 'no-results';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  variant = 'no-vehicles', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const Icon = variant === 'no-results' ? SearchOffOutlined : DirectionsCarOutlined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          py: 8,
          px: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Illustrated icon */}
        <Box
          sx={{
            position: 'relative',
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Icon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
            </motion.div>
          </Box>
          
          {/* Decorative dots */}
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              left: -12,
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.3),
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, maxWidth: 320 }}
        >
          {description}
        </Typography>

        {actionLabel && onAction && (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={onAction}
              sx={{ borderRadius: 20 }}
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
}

export default EmptyState;
