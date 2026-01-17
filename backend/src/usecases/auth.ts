import {
  isPasswordCorrect,
  generateIdToken,
  generateRefreshToken,
  hashPassword,
} from '../utils/auth.ts';
import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';

interface LoginParameters {
  email: string;
  password: string;
}
interface LoginReturn {
  idToken: string;
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

  const idToken = await generateIdToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = await generateRefreshToken(user.id);

  return { idToken, refreshToken };
}

interface CreateUserReturn {
  id: string;
  email: string;
  role: string;
}
async function createUser(
  email: string,
  password: string,
  role: string,
): Promise<CreateUserReturn> {
  const hashedPassword = await hashPassword(password);

  let user: CreateUserReturn;
  try {
    user = await db.users.insert(email, hashedPassword, role);
  } catch (error) {
    if ('cause' in error && error.cause.code === '23505') {
      throw new DomainError('conflict-error', {
        message: 'resource already exists.',
      });
    } else {
      throw new DomainError('internal-error', {
        error,
      });
    }
  }

  if (!user) {
    throw new DomainError('internal-error', {
      message: 'user was not created successfully.',
    });
  }

  return user;
}

const auth = {
  login,
  createUser,
};

export default auth;
