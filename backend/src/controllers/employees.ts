import { Router, type NextFunction, type Request, type Response } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import DomainError from '../models/DomainError.ts';
import type Employee from '../models/Employee.ts';
import employeesUsecase from '../usecases/employees.ts';

const employeesRouter = Router();

const employeeStatusValues = ['application_received', 'interview_scheduled', 'hired', 'not_accepted'] as const;

const CreateEmployeeRequest = z.object({
	email: z.email(),
	name: z.string().min(2),
	designation: z.string().min(2),
	status: z.enum(employeeStatusValues).optional(),
	mobile: z.string().min(1).optional(),
	address: z.string().min(1).optional(),
	companyId: z.uuid(),
	departmentId: z.uuid(),
	hiredOn: z.coerce.date().optional(),
});
employeesRouter.post(
	'',
	endpointWrapper(async function createEmployee(
		request: Request,
		response: Response,
		_next: NextFunction,
	): Promise<Employee> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { email, name, designation, status, mobile, address, companyId, departmentId, hiredOn } =
			CreateEmployeeRequest.parse(request.body);

		const employee = await employeesUsecase.createEmployee({
			accessToken,
			email,
			name,
			designation,
			status,
			mobile,
			address,
			companyId,
			departmentId,
			hiredOn,
		});

		response.status(201);

		return employee;
	}),
);

const UpdateEmployeeRequest = z.object({
	email: z.email().optional(),
	name: z.string().min(2).optional(),
	designation: z.string().min(2).optional(),
	status: z.enum(employeeStatusValues).optional(),
	mobile: z.string().min(1).optional(),
	address: z.string().min(1).optional(),
	companyId: z.uuid().optional(),
	departmentId: z.uuid().optional(),
	hiredOn: z.coerce.date().optional(),
});
employeesRouter.patch(
	'/:employeeId',
	endpointWrapper(async function updateEmployee(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Employee> {
		const accessToken = request.accessToken;

		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const employeeId = request.params.employeeId;

		if (!employeeId) {
			throw new DomainError('validation-error');
		}

		const updates = UpdateEmployeeRequest.parse(request.body);
		const employee = await employeesUsecase.updateEmployee({
			accessToken,
			employeeId,
			updates,
		});

		return employee;
	}),
);

const GetAllRequest = z.object({
	pointerId: z.uuid().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(10),
});
employeesRouter.get(
	'',
	endpointWrapper(async function getAll(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Employee[]> {
		const accessToken = request.accessToken;
		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const { pointerId, limit } = GetAllRequest.parse(request.query);

		return await employeesUsecase.getAll({
			accessToken,
			pointerId,
			limit,
		});
	}),
);

employeesRouter.get(
	'/:employeeId',
	endpointWrapper(async function getEmployee(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<Employee> {
		const accessToken = request.accessToken;

		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const employeeId = request.params.employeeId;

		if (!employeeId) {
			throw new DomainError('validation-error');
		}

		const employee = await employeesUsecase.getEmployee({
			accessToken,
			employeeId,
		});

		return employee;
	}),
);

employeesRouter.delete(
	'/:employeeId',
	endpointWrapper(async function deleteEmployee(
		request: Request,
		_response: Response,
		_next: NextFunction,
	): Promise<void> {
		const accessToken = request.accessToken;

		if (!accessToken) {
			throw new DomainError('authentication-required');
		}

		const employeeId = request.params.employeeId;

		if (!employeeId) {
			throw new DomainError('validation-error');
		}

		await employeesUsecase.deleteEmployee({
			accessToken,
			employeeId,
		});
	}),
);

export default employeesRouter;
