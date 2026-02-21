import 'express';

declare module 'express' {
  export interface Request {
    accessToken?: string | undefined;
  }
}
