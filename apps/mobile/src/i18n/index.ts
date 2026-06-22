import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from './en';
import hi from './hi';
import te from './te';

export const i18n = new I18n({ en, hi, te });

// Launch languages: English, Hindi, Telugu (docs/REQUIREMENTS.md FR-5).
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

export const setLocale = (code: 'en' | 'hi' | 'te') => {
  i18n.locale = code;
};

export const t = (key: string, opts?: Record<string, unknown>) =>
  i18n.t(key, opts);
