import { Router, type NextFunction, type Request, type Response } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import DomainError from '../models/DomainError.ts';
import type Role from '../models/Role.ts';
import rolesUsecase from '../usecases/roles.ts';

const rolesRouter = Router();

const CreateRoleRequest = z.object({
	name: z
		.string()
		.min(2)
		.regex(/^[a-zA-Z\s]+$/),
});
rolesRouter.post(
	'',
	endpointWrapper(async function createRole(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<Role> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { name } = CreateRoleRequest.parse(request.body);
		const role = await rolesUsecase.createRole({
			accessToken,
			name,
		});

		response.status(201);
		return role;
	}),
);

const UpdateRoleRequest = z.object({
	name: z
		.string()
		.min(2)
		.regex(/^[a-zA-Z\s]+$/)
		.optional(),
});
rolesRouter.patch(
	'/:roleId',
	endpointWrapper(async function updateRole(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Role> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const roleId = request.params.roleId;
		if (!roleId) {
			throw new DomainError('validation-error');
		}

		const { name } = UpdateRoleRequest.parse(request.body);

		if (!request.body.name) {
			throw new DomainError('validation-error', {
				message: 'at least one update field is required.',
			});
		}

		const role = await rolesUsecase.updateRole({
			accessToken,
			roleId,
			updates: { name },
		});

		return role;
	}),
);

const GetAllRequest = z.object({
	pointerId: z.uuid().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});
rolesRouter.get(
	'',
	endpointWrapper(async function getAll(request: Request, _response: Response, _next: NextFunction): Promise<Role[]> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { pointerId, limit } = GetAllRequest.parse(request.query);

		return await rolesUsecase.getAll({
			accessToken,
			pointerId,
			limit,
		});
	}),
);

rolesRouter.get(
	'/:roleId',
	endpointWrapper(async function getRole(request: Request, _response: Response, _next: NextFunction): Promise<Role> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const roleId = request.params.roleId;
		if (!roleId) {
			throw new DomainError('validation-error');
		}

		const role = await rolesUsecase.getRole({
			accessToken,
			roleId,
		});

		return role;
	}),
);

rolesRouter.delete(
	'/:roleId',
	endpointWrapper(async function deleteRole(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<void> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const roleId = request.params.roleId;
		if (!roleId) {
			throw new DomainError('validation-error');
		}

		await rolesUsecase.deleteRole({
			accessToken,
			roleId,
		});
	}),
);

export default rolesRouter;
