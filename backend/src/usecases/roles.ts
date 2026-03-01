import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import type Role from '../models/Role.ts';

interface CreateRoleParameters {
	name: Role['name'];
}
async function createRole({ name }: CreateRoleParameters): Promise<Role> {
	let role: Role | null;
	try {
		role = await db.roles.insert(name);
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', {
			error,
		});
	}

	if (!role) {
		throw new DomainError('internal-error', {
			message: 'No role was added',
		});
	}

	return role;
}

interface UpdateRoleParameters {
	roleId: Role['id'];
	updates: {
		name?: Role['name'];
	};
}
async function updateRole({ roleId, updates }: UpdateRoleParameters): Promise<Role> {
	if (!updates.name) {
		throw new DomainError('validation-error', {
			message: 'at least one update field is required.',
		});
	}

	let role: Role | null;
	try {
		role = await db.roles.update({
			id: roleId,
			updates,
		});
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				message: 'resource already exists.',
			});
		}

		throw new DomainError('internal-error', {
			error,
		});
	}

	if (!role) {
		throw new DomainError('not-found');
	}

	return role;
}

interface GetRoleParameters {
	roleId: Role['id'];
}
async function getRole({ roleId }: GetRoleParameters): Promise<Role> {
	const role = await db.roles.getById(roleId);
	if (!role) {
		throw new DomainError('not-found');
	}

	return role;
}

interface GetAllParameters {
	pointerId?: Role['id'];
	limit?: number;
}
async function getAll({ pointerId, limit }: GetAllParameters): Promise<Role[]> {
	return await db.roles.getAll({
		pointerId,
		limit,
	});
}

interface DeleteRoleParameters {
	roleId: Role['id'];
}
async function deleteRole({ roleId }: DeleteRoleParameters): Promise<void> {
	const result = await db.roles.deleteById({ id: roleId });
	if (!result) {
		throw new DomainError('not-found');
	}
}

const role = {
	createRole,
	updateRole,
	getAll,
	getRole,
	deleteRole,
};

export default role;
