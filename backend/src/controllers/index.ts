import { Router } from 'express';
import authRouter from './auth.ts';
import userRouter from './users.ts';
import rolesRouter from './roles.ts';
import companyRouter from './companies.ts';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/role', rolesRouter);
router.use('/company', companyRouter);

export default router;
