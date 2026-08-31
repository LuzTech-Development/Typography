import { pt } from './pt';
import { en } from './en';

export type Locale = 'en-us' | 'pt-br';

export const locales: Locale[] = ['en-us', 'pt-br'];
export const defaultLocale: Locale = 'en-us';
export const localePaths = { 'en-us': '/en-us', 'pt-br': '/pt-br' } as const;

export const dictionaries = { 'en-us': en, 'pt-br': pt } as const;

export type Dictionary = typeof en;
