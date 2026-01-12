'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Button, Box, Typography, alpha } from '@mui/material';
import { SystemUpdateAltOutlined, CloseOutlined } from '@mui/icons-material';

export function ServiceWorkerRegistration() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  setWaitingWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });

      // Handle controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show after some interaction
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowInstallPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
    setShowUpdatePrompt(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <>
      {/* Update available prompt */}
      <Snackbar
        open={showUpdatePrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SystemUpdateAltOutlined fontSize="small" />
            <Typography variant="body2">
              A new version is available
            </Typography>
          </Box>
        }
        action={
          <>
            <Button color="primary" size="small" onClick={handleUpdate}>
              Update
            </Button>
            <Button color="inherit" size="small" onClick={() => setShowUpdatePrompt(false)}>
              Later
            </Button>
          </>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.95),
          },
        }}
      />

      {/* Install prompt */}
      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setShowInstallPrompt(false)}
        message={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src="/VozenPark_logo.svg"
              alt=""
              sx={{ width: 20, height: 20 }}
            />
            <Typography variant="body2">
              Install VozenPark.mk for quick access
            </Typography>
          </Box>
        }
        action={
          <>
            <Button color="primary" size="small" onClick={handleInstall}>
              Install
            </Button>
            <Button color="inherit" size="small" onClick={() => setShowInstallPrompt(false)}>
              <CloseOutlined fontSize="small" />
            </Button>
          </>
        }
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: 'background.paper',
            color: 'text.primary',
          },
        }}
      />
    </>
  );
}

// Type for beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default ServiceWorkerRegistration;
