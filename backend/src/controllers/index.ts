import { Router } from 'express';
import authRouter from './auth.ts';
import userRouter from './users.ts';
import rolesRouter from './roles.ts';

const router = Router();

router.use(authRouter);
router.use('/user', userRouter);
router.use('/role', rolesRouter);

export default router;
