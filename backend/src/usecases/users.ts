import db from '../db/index.ts';
import { hashPassword } from '../infrastructure/auth.ts';
import DomainError from '../models/DomainError.ts';
import type User from '../models/User.ts';

interface ActorContext {
	userId: User['id'];
	roleId: User['role'];
}

interface CreateUserParameters {
	actor: ActorContext;
	newUserData: {
		email: User['email'];
		password: string;
		roleId: User['role'];
	};
}
async function createUser({ actor, newUserData }: CreateUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('user.create')) {
		throw new DomainError('not-authorized');
	}

	const hashedPassword = await hashPassword(newUserData.password);
	const { email, roleId } = newUserData;

	let newUser: Omit<User, 'hashedPassword'> | null;
	try {
		newUser = await db.users.insert(email, hashedPassword, roleId);
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

	if (!newUser) {
		throw new DomainError('internal-error');
	}

	return newUser;
}

interface UpdateUserParameters {
	userId: User['id'];
	actor: ActorContext;
	updates: {
		email?: User['email'];
		password?: string;
		role?: User['role'];
	};
}
async function updateUser({ userId, actor, updates }: UpdateUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);
	const canReadUser = permissionNames.includes('user.read');

	if (!permissionNames.includes('user.update')) {
		throw new DomainError('not-authorized');
	}

	if (!canReadUser && userId !== actor.userId) {
		throw new DomainError('not-authorized');
	}

	if (!canReadUser && updates.role !== undefined) {
		throw new DomainError('not-authorized');
	}

	const dbUpdates: {
		email?: User['email'];
		hashedPassword?: User['hashedPassword'];
		role?: User['role'];
	} = {};

	if (updates.email !== undefined) {
		dbUpdates.email = updates.email;
	}
	if (updates.role !== undefined) {
		dbUpdates.role = updates.role;
	}
	if (updates.password !== undefined) {
		dbUpdates.hashedPassword = await hashPassword(updates.password);
	}

	if (!dbUpdates.email && !dbUpdates.hashedPassword && !dbUpdates.role) {
		throw new DomainError('validation-error', {
			message: 'at least one update field is required.',
		});
	}

	let user: Omit<User, 'hashedPassword'> | null;
	try {
		user = await db.users.update({
			id: userId,
			updates: dbUpdates,
		});
	} catch (error) {
		if ('cause' in error && error.cause.code === '23505') {
			throw new DomainError('conflict-error', {
				email: {
					message: 'This email is already used',
				},
			});
		}

		throw new DomainError('internal-error', {
			error,
		});
	}

	if (!user) {
		throw new DomainError('not-found');
	}

	return user;
}

interface GetUserParameters {
	userId: User['id'];
	actor: ActorContext;
}
async function getUser({ userId, actor }: GetUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);
	const canReadUser = permissionNames.includes('user.read');
	const canReadSelfUser = permissionNames.includes('user.read_self');

	if (!canReadUser && !canReadSelfUser) {
		throw new DomainError('not-authorized');
	}

	if (canReadSelfUser && !canReadUser && userId !== actor.userId) {
		throw new DomainError('not-authorized');
	}

	const user = await db.users.getById(userId);
	if (!user) {
		throw new DomainError('not-found');
	}

	return user;
}

interface GetAllParameters {
	pointerId?: User['id'];
	limit?: number;
	actor: ActorContext;
}
async function getAll({ pointerId, limit, actor }: GetAllParameters): Promise<Array<Omit<User, 'hashedPassword'>>> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('user.list')) {
		throw new DomainError('not-authorized');
	}

	return await db.users.getAll({
		pointerId,
		limit,
	});
}

interface DeleteUserParameters {
	userId: User['id'];
	actor: ActorContext;
}
async function deleteUser({ userId, actor }: DeleteUserParameters): Promise<void> {
	const permissionNames = await db.rolePermissions.getPermissionNamesByRoleId(actor.roleId);

	if (!permissionNames.includes('user.delete')) {
		throw new DomainError('not-authorized');
	}

	const result = await db.users.deleteById({ id: userId });
	if (!result) {
		throw new DomainError('not-found');
	}
}

const user = {
	createUser,
	updateUser,
	getAll,
	getUser,
	deleteUser,
};

export default user;
