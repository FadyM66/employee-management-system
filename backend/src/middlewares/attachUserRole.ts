import type { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import db from '../db/index.ts';

export async function attachUserRole(
	request: ExpressRequest,
	_response: ExpressResponse,
	next: NextFunction,
): Promise<void> {
	const userId = request.auth?.userId;

	if (!userId) {
		request.auth = {
			userId: undefined,
			roleId: undefined,
			email: undefined,
		};

		return next();
	}

	const user = await db.users.getById(userId);

	if (!user) {
		request.auth = {
			userId: undefined,
			roleId: undefined,
			email: undefined,
		};

		return next();
	}

	request.auth = {
		userId,
		roleId: user.role,
		email: user.email,
	};

	return next();
}
