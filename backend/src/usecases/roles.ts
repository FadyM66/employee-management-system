import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import Role from '../models/Role.ts';

interface AddRoleParameters {
  role: {
    name: string;
  };
}
async function createRole({ role }: AddRoleParameters): Promise<Role> {
  let newRole: Role;

  try {
    newRole = await db.roles.insert(role.name);
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

  if (!newRole) {
    throw new DomainError('internal-error', {
      message: 'No role was added',
    });
  }

  return newRole;
}

const role = {
  createRole,
};

export default role;
