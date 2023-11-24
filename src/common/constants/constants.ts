import { I18n } from 'i18n';
import path from 'path';

const lang = ['en', 'vi'];
const i18n = new I18n({
  locales: lang,
  defaultLocale: 'en',
  directory: path.join(__dirname, '../../locales'),
  api: {
    __: 't',
    __n: 'tN',
  },
});

const constants = {
  lang,
  i18n,
};

export default constants;
