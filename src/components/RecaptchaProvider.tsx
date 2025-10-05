"use client";

import { useEffect, useState } from 'react';
import { loadRecaptchaScript } from '@/lib/recaptcha';

export default function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.warn('reCAPTCHA site key not configured - skipping reCAPTCHA initialization');
      setIsLoaded(true);
      return;
    }

    console.log('Initializing reCAPTCHA with site key:', siteKey);

    loadRecaptchaScript(siteKey)
      .then(() => {
        console.log('reCAPTCHA loaded and ready');
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load reCAPTCHA:', error);
        setIsLoaded(true); // Continue anyway in case of error
      });
  }, []);

  return <>{children}</>;
}
