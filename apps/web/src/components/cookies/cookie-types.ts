export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  timestamp: string;
  version: string;
}

export const COOKIE_STORAGE_KEY = 'life_track_cookie_consent';
export const COOKIE_CONSENT_VERSION = '1.0';
