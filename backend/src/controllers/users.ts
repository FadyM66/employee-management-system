import { Router, type NextFunction, type Request, type Response } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import DomainError from '../models/DomainError.ts';
import type User from '../models/User.ts';
import userUsecase from '../usecases/users.ts';

const userRouter = Router();

const CreateUserRequest = z.object({
	email: z.email(),
	password: z.string().min(6),
	roleId: z.string(),
});
userRouter.post(
	'',
	endpointWrapper(async function createUser(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<Omit<User, 'hashedPassword'>> {
		if (!request.auth?.userId) {
			throw new DomainError('authentication-required');
		}

		const { email, password, roleId } = CreateUserRequest.parse(request.body);
		const user = await userUsecase.createUser({
			email,
			password,
			roleId,
		});

		response.status(201);

		return user;
	}),
);

const UpdateUserRequest = z.object({
	email: z.email().optional(),
	password: z.string().min(6).optional(),
	role: z.uuid().optional(),
});
userRouter.patch(
	'/:userId',
	endpointWrapper(async function updateUser(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Omit<User, 'hashedPassword'>> {
		if (!request.auth?.userId) {
			throw new DomainError('authentication-required');
		}

		const userId = request.params.userId;

		if (!userId) {
			throw new DomainError('validation-error');
		}

		if (!request.body.email && !request.body.password && !request.body.role) {
			throw new DomainError('validation-error', {
				message: 'at least one update field is required.',
			});
		}

		const updates = UpdateUserRequest.parse(request.body);

		const user = await userUsecase.updateUser({
			userId,
			updates,
		});

		return user;
	}),
);

const GetAllRequest = z.object({
	pointerId: z.uuid().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});
userRouter.get(
	'',
	endpointWrapper(async function getAll(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Array<Omit<User, 'hashedPassword'>>> {
		if (!request.auth?.userId) {
			throw new DomainError('authentication-required');
		}

		const { pointerId, limit } = GetAllRequest.parse(request.query);

		return await userUsecase.getAll({
			pointerId,
			limit,
		});
	}),
);

userRouter.get(
	'/:userId',
	endpointWrapper(async function getUser(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Omit<User, 'hashedPassword'>> {
		if (!request.auth?.userId) {
			throw new DomainError('authentication-required');
		}

		const userId = request.params.userId;
		if (!userId) {
			throw new DomainError('validation-error');
		}

		const user = await userUsecase.getUser({
			userId,
		});

		return user;
	}),
);

userRouter.delete(
	'/:userId',
	endpointWrapper(async function deleteUser(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<void> {
		if (!request.auth?.userId) {
			throw new DomainError('authentication-required');
		}

		const userId = request.params.userId;
		if (!userId) {
			throw new DomainError('validation-error');
		}

		await userUsecase.deleteUser({
			userId,
		});
	}),
);

export default userRouter;
