import {
  validatePassword,
  generateAccessToken,
  generateRefreshToken,
} from '../infrastructure/auth.ts';
import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import type User from '../models/User.ts';

interface LoginParameters {
  email: string;
  password: string;
}
interface LoginReturn {
  user: {
    id: User['id'];
    email: User['email'];
    role: User['role'];
  };
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
async function login({
  email,
  password,
}: LoginParameters): Promise<LoginReturn> {
  const user = await db.users.getByEmail(email);

  if (!user) {
    throw new DomainError('invalid-credentials');
  }

  const authenticated: boolean = await validatePassword(
    user.hashedPassword,
    password,
  );

  if (!authenticated) {
    throw new DomainError('invalid-credentials');
  }

  const { accessToken, expiresAt: accessTokenExpiresAt } = generateAccessToken({
    id: user.id,
  });
  const { refreshToken, expiresAt: refreshTokenExpiresAt } =
    generateRefreshToken({ id: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  };
}

const auth = {
  login,
};

export default auth;
