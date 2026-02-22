import { Router, type NextFunction, type Request, type Response } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import departmentsUsecase from '../usecases/departments.ts';
import type Department from '../models/Department.ts';
import DomainError from '../models/DomainError.ts';

const departmentsRouter = Router();

const CreateDepartmentRequest = z.object({
	name: z.string().min(2),
	companyId: z.uuid(),
	head: z.uuid().optional(),
});
departmentsRouter.post(
	'',
	endpointWrapper(async function createDepartment(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<Department> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { name, companyId, head } = CreateDepartmentRequest.parse(request.body);
		const department = await departmentsUsecase.createDepartment({
			accessToken,
			name,
			companyId,
			head,
		});

		response.status(201);

		return department;
	}),
);

const UpdateDepartmentRequest = z.object({
	name: z.string().min(2).optional(),
	companyId: z.uuid().optional(),
	head: z.uuid().optional(),
});
departmentsRouter.patch(
	'/:departmentId',
	endpointWrapper(async function updateDepartment(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Department> {
		const accessToken = request.accessToken;

		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const departmentId = request.params.departmentId;

		if (!departmentId) {
			throw new DomainError('validation-error');
		}

		const updates = UpdateDepartmentRequest.parse(request.body);

		if (!request.body.name && !request.body.companyId && !request.body.head) {
			throw new DomainError('validation-error', {
				message: 'at least one update field is required.',
			});
		}

		const department = await departmentsUsecase.updateDepartment({
			accessToken,
			departmentId,
			updates,
		});

		return department;
	}),
);

departmentsRouter.get(
	'/:departmentId',
	endpointWrapper(async function getDepartment(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Department> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const departmentId = request.params.departmentId;

		if (!departmentId) {
			throw new DomainError('validation-error');
		}

		const department = await departmentsUsecase.getDepartment({
			accessToken,
			departmentId,
		});

		return department;
	}),
);

const DeleteDepartmentRequest = z.object({
	departmentId: z.uuid(),
});
departmentsRouter.delete(
	'/:departmentId',
	endpointWrapper(async function deleteDepartment(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<void> {
		const accessToken = request.accessToken;

		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { departmentId } = DeleteDepartmentRequest.parse(request.params);
		await departmentsUsecase.deleteDepartment({
			accessToken,
			departmentId,
		});
	}),
);

export default departmentsRouter;
