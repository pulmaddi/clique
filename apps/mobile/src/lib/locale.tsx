import { createContext, useContext } from 'react';

export type Lang = 'en' | 'hi' | 'te';

/** Current UI language + setter. State lives in App so changing it re-renders
 *  the whole screen tree (so every `t()` call picks up the new language). */
export const LocaleContext = createContext<{
  lang: Lang;
  changeLang: (l: Lang) => void;
}>({ lang: 'en', changeLang: () => {} });

export const useLocale = () => useContext(LocaleContext);

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
];
