import { type Request as ExpressRequest, type Response as ExpressResponse, type NextFunction } from 'express';
import DomainError from '../models/DomainError.ts';

export function extractAccessToken(request: ExpressRequest, _response: ExpressResponse, next: NextFunction) {
	if (request.headers.authorization) {
		if (!request.headers.authorization.startsWith('Bearer ')) {
			throw new DomainError('authentication-required');
		}

		request.accessToken = request.headers.authorization.split(' ').pop();
	}

	next();
}
