import { i18nAPI } from 'i18n';

declare global {
  namespace Express {
    interface Response {
      sendJson(data: unknown): this;
      t(key: string): i18nAPI['__'];
      tN(key: string): i18nAPI['__n'];
    }
  }
}

export {};
