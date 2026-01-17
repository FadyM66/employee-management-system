import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

interface GenerateRefreshTokenParameters {
  id: string;
  email: string;
  role: User['role'];
}
export function generateRefreshToken(
  payload: GenerateRefreshTokenParameters,
): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: '24h',
  });
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, parseInt(process.env.SALT));
}

export async function isPasswordCorrect(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

type VerifyAccessTokenReturn = Omit<User, 'password'>;
export function verifyIdToken(accessToken: string): VerifyAccessTokenReturn {
  return jwt.verify(
    accessToken,
    process.env.JWT_SECRET_KEY,
  ) as VerifyAccessTokenReturn;
}

type VerifyRefreshTokenReturn = Omit<User, 'password'>;
export function verifyRefreshToken(
  refreshToken: string,
): VerifyRefreshTokenReturn {
  const jwtPayload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY,
  ) as VerifyRefreshTokenReturn;

  return {
    id: jwtPayload.id,
    email: jwtPayload.email,
    role: jwtPayload.role,
  };
}
