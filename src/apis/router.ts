import express, { Response } from 'express';
import create from '@apis/example/example.route';

const router = express.Router();

router.get('/health-check', (res: Response) => res.send(res.t('hello')));

router.use('/example', create);

export default router;
