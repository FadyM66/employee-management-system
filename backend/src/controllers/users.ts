import { Router, Response, Request, NextFunction } from 'express';
import * as z from 'zod';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import authUsecase from '../usecases/auth.ts';

const userRouter = Router();

const CreateUserRequest = z.object({
  email: z.email(),
  password: z.string().min(6),
  role: z.uuid(),
});
userRouter.post(
  '/user',
  endpointWrapper(async function createUser(
    request: Request,
    response: Response,
    _next: NextFunction,
  ) {
    const { email, password, role } = CreateUserRequest.parse(request.body);
    const user = await authUsecase.createUser(email, password, role);

    response.status(201);

    return user;
  }),
);

export default userRouter;
