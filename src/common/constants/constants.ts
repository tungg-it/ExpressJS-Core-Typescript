import { I18n } from 'i18n';
import path from 'path';

const lang = ['en', 'vi'];
const i18n = new I18n({
  locales: lang,
  directory: path.join(__dirname, '../../locales'),
  defaultLocale: 'en',
});

const constants = {
  lang,
  i18n,
};

export default constants;
