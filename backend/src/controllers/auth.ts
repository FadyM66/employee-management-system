import * as z from 'zod';
import Router, { type Response, type Request, type NextFunction } from 'express';
import authUsecase from '../usecases/auth.ts';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import type User from '../models/User.ts';

const authRouter = Router();

const LoginRequest = z.object({
	email: z.string().max(60),
	password: z.string().max(50),
});
interface LoginResponse {
	user: Omit<User, 'hashedPassword'>;
	accessToken: string;
	expiresIn: string;
}
authRouter.post(
	'/login',
	endpointWrapper(async function login(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<LoginResponse> {
		const { email, password } = LoginRequest.parse(request.body);
		const result = await authUsecase.login({
			email,
			password,
		});

		response.cookie('refreshToken', result.refreshToken, {
			httpOnly: true,
			path: '/auth/refresh-token',
			expires: new Date(result.refreshTokenExpiresAt),
		});

		return {
			user: result.user,
			accessToken: result.accessToken,
			expiresIn: result.accessTokenExpiresAt,
		};
	}),
);

interface refreshToken {
	accessToken: string;
	expiresIn: string;
}
authRouter.post(
	'/refresh-token',
	endpointWrapper(async function refreshToken(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<refreshToken> {
		const refreshToken = request.cookies.refreshToken;

		const sessionTokens = await authUsecase.refreshToken({ refreshToken });

		response.cookie('refreshToken', sessionTokens.refreshToken, {
			httpOnly: true,
			path: '/auth/refresh-token',
			expires: new Date(sessionTokens.refreshTokenExpiresAt),
		});

		return {
			accessToken: sessionTokens.accessToken,
			expiresIn: sessionTokens.accessTokenExpiresAt,
		};
	}),
);

export default authRouter;
