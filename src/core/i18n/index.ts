import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';

export async function initI18n(): Promise<void> {
  await i18next.use(Backend).init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    backend: {
      loadPath: join(__dirname, '../../../locales/{{lng}}/{{ns}}.json'),
    },
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
  });
}

export function t(key: string, options?: any): string {
  return i18next.t(key, options) as string;
}

export default i18next;
