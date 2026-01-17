import { Router, Response, Request, NextFunction } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import rolesUsecase from '../usecases/roles.ts';

const rolesRouter = Router();

const CreateRoleRequest = z.object({
  role_name: z
    .string()
    .min(2)
    .regex(/^[a-zA-Z\s]+$/),
});
rolesRouter.post(
  '/',
  endpointWrapper(async function createRole(
    request: Request,
    response: Response,
    _next: NextFunction,
  ) {
    const { role_name: name } = CreateRoleRequest.parse(request.body);
    const newRole = await rolesUsecase.createRole({ role: { name } });

    response.status(201);

    return newRole;
  }),
);

export default rolesRouter;
