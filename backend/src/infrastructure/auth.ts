import jwt, { type JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.ts';

interface GenerateAccessTokenParameters {
  id: User['id'];
}
interface GenerateAccessTokenReturn {
  accessToken: string;
  expiresAt: string;
}
export function generateAccessToken(
  payload: GenerateAccessTokenParameters,
): GenerateAccessTokenReturn {
  const expiresInSeconds = 60 * 60;
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: expiresInSeconds,
  });
  const expiresAt = new Date(
    Date.now() + expiresInSeconds * 1000,
  ).toISOString();

  return {
    accessToken,
    expiresAt,
  };
}

interface GenerateRefreshTokenParameters {
  id: string;
}
interface GenerateRefreshTokenReturn {
  refreshToken: string;
  expiresAt: string;
}
export function generateRefreshToken(
  payload: GenerateRefreshTokenParameters,
): GenerateRefreshTokenReturn {
  const expiresInSeconds = 24 * 60 * 60;

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY!, {
    expiresIn: expiresInSeconds,
  });

  const expiresAt = new Date(
    Date.now() + expiresInSeconds * 1000,
  ).toISOString();

  return {
    refreshToken,
    expiresAt,
  };
}

export async function validatePassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

interface RefreshTokenPayload extends JwtPayload {
  id: string;
}
export function verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET_KEY!,
  ) as RefreshTokenPayload;

  return payload;
}
