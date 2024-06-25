import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/health-check', (req: Request, res: Response) => res.send('OK'));

export default router;
