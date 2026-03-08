import db from '../db/index.ts';
import DomainError from '../models/DomainError.ts';
import type Role from '../models/Role.ts';

interface ActorContext {
	roleId: string;
}

interface CreateRoleParameters {
	name: Role['name'];
	actor: ActorContext;
}
async function createRole({ name, actor }: CreateRoleParameters): Promise<Role> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('role.create')) {
		throw new DomainError('not-authorized');
	}

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
		throw new DomainError('internal-error');
	}

	return role;
}

interface UpdateRoleParameters {
	roleId: Role['id'];
	actor: ActorContext;
	updates: {
		name?: Role['name'];
	};
}
async function updateRole({ roleId, actor, updates }: UpdateRoleParameters): Promise<Role> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('role.update')) {
		throw new DomainError('not-authorized');
	}

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
	actor: ActorContext;
}
async function getRole({ roleId, actor }: GetRoleParameters): Promise<Role> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('role.read')) {
		throw new DomainError('not-authorized');
	}

	const role = await db.roles.getById(roleId);

	if (!role) {
		throw new DomainError('not-found');
	}

	return role;
}

interface GetAllParameters {
	pointerId?: Role['id'];
	limit?: number;
	actor: ActorContext;
}
async function getAll({ pointerId, limit, actor }: GetAllParameters): Promise<Role[]> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('role.list')) {
		throw new DomainError('not-authorized');
	}

	return await db.roles.getAll({
		pointerId,
		limit,
	});
}

interface DeleteRoleParameters {
	roleId: Role['id'];
	actor: ActorContext;
}
async function deleteRole({ roleId, actor }: DeleteRoleParameters): Promise<void> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('role.delete')) {
		throw new DomainError('not-authorized');
	}

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
