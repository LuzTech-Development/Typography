import {
    defaultLocale,
    dictionaries,
    localePaths,
    locales,
    type Locale
} from '@/i18n';

export function isLocale(value: string): value is Locale {
    return (locales as string[]).includes(value);
}

/** Reads the locale from the URL pathname. `/en-us/...` or `/pt-br/...` → locale; otherwise defaults to en-us. */
export function getLocale(url: URL): Locale {
    const first = url.pathname.split('/').filter(Boolean)[0];
    return first && isLocale(first) ? first : defaultLocale;
}

/** Returns the dictionary for a given locale. */
export function t(locale: Locale) {
    return dictionaries[locale];
}

/** Builds the path prefix for a locale (`/en-us` or `/pt-br`). */
export function localePrefix(locale: Locale): string {
    return localePaths[locale];
}

/** Returns the URL for the alternate locale, preserving the current path. */
export function alternateHref(url: URL, target: Locale): string {
    const parts = url.pathname.split('/').filter(Boolean);
    if (!(parts[0] && isLocale(parts[0]))) {
        return `${localePrefix(target)}/`;
    }
    parts.shift();
    const rest = parts.join('/');
    const prefix = localePrefix(target);
    return `${prefix}/${rest}`.replace(/\/+$/, '') || '/';
}

export function otherLocale(locale: Locale): Locale {
    return locale === 'en-us' ? 'pt-br' : 'en-us';
}
