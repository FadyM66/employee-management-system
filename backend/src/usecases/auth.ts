import {
  isPasswordCorrect,
  generateIdToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from '../utils/auth.ts';
import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import User from '../models/User.ts';

interface LoginParameters {
  email: string;
  password: string;
}
interface LoginReturn {
  accessToken: string;
  refreshToken: string;
}
async function login({
  email,
  password,
}: LoginParameters): Promise<LoginReturn> {
  const user = await db.users.getByEmail(email);

  if (!user) {
    throw new DomainError('invalid-credentials');
  }

  const isAuthenticated = await isPasswordCorrect(user.password, password);

  if (!isAuthenticated) {
    throw new DomainError('invalid-credentials');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateIdToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
}
interface RefreshTokenReturn {
  accessToken: string;
  refreshToken: string;
}
async function refreshToken(refreshToken: string): Promise<RefreshTokenReturn> {
  let user: Omit<User, 'password'>;

  try {
    user = verifyRefreshToken(refreshToken);
  } catch (error) {
    if (
      error.message === 'jwt malformed' ||
      error.message === 'jwt expired' ||
      error.message === 'invalid signature'
    ) {
      throw new DomainError('authentication-required');
    } else {
      throw new DomainError('internal-error', { error });
    }
  }

  const accessToken = generateIdToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

const auth = {
  login,
  refreshToken,
};

export default auth;
