import { Router } from 'express';
import authRouter from './auth.ts';
import userRouter from './users.ts';
import rolesRouter from './roles.ts';
import companyRouter from './companies.ts';
import departmentsRouter from './departments.ts';
import employeesRouter from './employees.ts';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/roles', rolesRouter);
router.use('/companies', companyRouter);
router.use('/departments', departmentsRouter);
router.use('/employees', employeesRouter);

export default router;
