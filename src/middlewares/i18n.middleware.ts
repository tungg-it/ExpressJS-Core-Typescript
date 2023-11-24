import { Response, NextFunction, Request } from 'express';
import constants from '@constants/constants';
const i18nMiddleware = (req: Request, res: Response, next: NextFunction) => {
  constants.i18n.setLocale(req, req.headers['x-lang']);
  next();
};

export default i18nMiddleware;
