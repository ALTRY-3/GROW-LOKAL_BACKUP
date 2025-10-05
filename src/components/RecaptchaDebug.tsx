"use client";

import { useEffect } from 'react';

export default function RecaptchaDebug() {
  useEffect(() => {
    console.log('=== reCAPTCHA Debug Info ===');
    console.log('NEXT_PUBLIC_RECAPTCHA_SITE_KEY:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Window grecaptcha:', typeof window !== 'undefined' ? (window as any).grecaptcha : 'undefined');
    
    if (typeof window !== 'undefined') {
      const checkInterval = setInterval(() => {
        if ((window as any).grecaptcha) {
          console.log('✓ grecaptcha object found:', (window as any).grecaptcha);
          console.log('✓ grecaptcha.ready:', typeof (window as any).grecaptcha.ready);
          console.log('✓ grecaptcha.execute:', typeof (window as any).grecaptcha.execute);
          clearInterval(checkInterval);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (!(window as any).grecaptcha) {
          console.error('✗ grecaptcha not loaded after 10 seconds');
        }
      }, 10000);
    }
  }, []);

  return null;
}
