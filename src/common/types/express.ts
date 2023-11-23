import { Response } from 'express';

export interface Res extends Response {
  [key: string]: any;
}
