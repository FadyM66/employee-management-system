import { Router, Response, Request, NextFunction } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import authUsecase from '../usecases/auth.ts';

const authRouter = Router();

const LoginRequest = z.object({
  email: z.email(),
  password: z.string(),
});
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}
authRouter.post(
  '/login',
  endpointWrapper(async function login(
    request: Request,
    _response: Response,
    _next: NextFunction,
  ) {
    const { email, password } = LoginRequest.parse(request.body);
    const sessionData: LoginResponse = await authUsecase.login({
      email,
      password,
    });

    return sessionData;
  }),
);

const RefreshTokenRequest = z.object({
  refreshToken: z.string().min(1),
});
authRouter.post(
  '/refresh-token',
  endpointWrapper(async function refreshToken(
    request: Request,
    _response: Response,
    _next: NextFunction,
  ) {
    const { refreshToken } = RefreshTokenRequest.parse(request.body);
    const result: { accessToken: string; refreshToken } =
      await authUsecase.refreshToken(refreshToken);

    return result;
  }),
);
export default authRouter;
