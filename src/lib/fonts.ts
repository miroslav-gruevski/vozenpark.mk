import { Roboto } from 'next/font/google';

// Roboto font with all weights and subsets for multilingual support
export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
  variable: '--font-roboto',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Note: Google Sans is not available in next/font/google
// Using Roboto as the primary font with CSS fallback to Google Sans if loaded externally
