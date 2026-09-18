'use client';

import { useSyncExternalStore } from 'react';
import {
  CookiePreferences,
  COOKIE_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
} from './cookie-types';

const defaultPrefs: CookiePreferences = {
  essential: true,
  analytics: false,
  preferences: false,
  timestamp: '',
  version: COOKIE_CONSENT_VERSION,
};

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('cookie-consent-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('cookie-consent-updated', callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(COOKIE_STORAGE_KEY) || '';
}

function getServerSnapshot(): string {
  return '';
}

export function useCookiePreferences() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  let prefs: CookiePreferences = defaultPrefs;
  let hasConsented = false;

  if (snapshot) {
    try {
      const parsed = JSON.parse(snapshot);
      if (parsed.version === COOKIE_CONSENT_VERSION) {
        prefs = parsed;
        hasConsented = true;
      }
    } catch {}
  }

  const save = (newPrefs: { analytics: boolean; preferences: boolean }) => {
    const data: CookiePreferences = {
      essential: true,
      analytics: newPrefs.analytics,
      preferences: newPrefs.preferences,
      timestamp: new Date().toISOString(),
      version: COOKIE_CONSENT_VERSION,
    };

    localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(data));
    document.cookie = `life_track_cookie_consent=true; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent('cookie-consent-updated', { detail: data }),
    );
  };

  return { prefs, hasConsented, save };
}
