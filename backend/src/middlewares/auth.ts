import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { verifyAccessToken } from '../infrastructure/auth.ts';

export function authenticateRequest(request: ExpressRequest, _response: ExpressResponse, next: NextFunction): void {
	if (!request.accessToken) {
		request.auth = { userId: undefined };

		return next();
	}

	try {
		const payload = verifyAccessToken(request.accessToken);
		request.auth = { userId: payload.id };
	} catch {
		request.auth = { userId: undefined };
	}

	return next();
}
