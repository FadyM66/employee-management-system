import { Router } from 'express';
import authRouter from './auth.ts';
import userRouter from './users.ts';

const router = Router();

router.use(authRouter);
router.use(userRouter);

export default router;
