'use client';

import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { WifiOffOutlined, RefreshOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.04)} 100%)`,
        p: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            {/* Icon */}
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <WifiOffOutlined sx={{ fontSize: 48, color: 'warning.main' }} />
                </motion.div>
              </Box>
              
              {/* Logo overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 2,
                }}
              >
                <Box
                  component="img"
                  src="/VozenPark_logo.svg"
                  alt="VozenPark"
                  sx={{ width: 24, height: 24 }}
                />
              </Box>
            </Box>

            {/* Text */}
            <Typography variant="h4" fontWeight={600} gutterBottom>
              You&apos;re Offline
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}
            >
              It looks like you&apos;ve lost your internet connection. 
              Please check your connection and try again.
            </Typography>

            {/* Retry button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshOutlined />}
                onClick={handleRetry}
                sx={{ borderRadius: 20, px: 4 }}
              >
                Try Again
              </Button>
            </motion.div>

            {/* Cached info */}
            <Typography 
              variant="caption" 
              color="text.disabled" 
              sx={{ mt: 4, display: 'block' }}
            >
              Some cached content may still be available
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
