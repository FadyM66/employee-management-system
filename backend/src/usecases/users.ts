import db from '../db/index.ts';
import { hashPassword } from '../infrastructure/auth.ts';
import DomainError from '../models/DomainError.ts';
import User from '../models/User.ts';

type CreateUserReturn = Pick<User, 'id' | 'email' | 'role'>
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

const user = {
  createUser,
};

export default user;
