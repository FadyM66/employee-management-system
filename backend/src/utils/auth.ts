import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

interface generateJWTParameter {
  id: string;
  email: string;
  role: User['role'];
}
export function generateIdToken(payload: generateJWTParameter): string {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
}
