import db from '../db/index.ts';
import { hashPassword, verifyAccessToken } from '../infrastructure/auth.ts';
import DomainError from '../models/DomainError.ts';
import type User from '../models/User.ts';

interface CreateUserParameters {
	accessToken: string;
	email: User['email'];
	password: string;
	roleId: User['role'];
}
async function createUser({
	accessToken,
	email,
	password,
	roleId,
}: CreateUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const hashedPassword = await hashPassword(password);

	let user: Omit<User, 'hashedPassword'> | null;
	try {
		user = await db.users.insert(email, hashedPassword, roleId);
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

	if (!user) {
		throw new DomainError('internal-error');
	}

	return user;
}

interface UpdateUserParameters {
	accessToken: string;
	userId: User['id'];
	updates: {
		email?: User['email'];
		password?: string;
		role?: User['role'];
	};
}
async function updateUser({
	accessToken,
	userId,
	updates,
}: UpdateUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
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
	accessToken: string;
	userId: User['id'];
}
async function getUser({ accessToken, userId }: GetUserParameters): Promise<Omit<User, 'hashedPassword'>> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const user = await db.users.getById(userId);
	if (!user) {
		throw new DomainError('not-found');
	}

	return user;
}

interface DeleteUserParameters {
	accessToken: string;
	userId: User['id'];
}
async function deleteUser({ accessToken, userId }: DeleteUserParameters): Promise<void> {
	try {
		verifyAccessToken(accessToken);
	} catch {
		throw new DomainError('authentication-required');
	}

	const result = await db.users.deleteById({ id: userId });
	if (!result) {
		throw new DomainError('not-found');
	}
}

const user = {
	createUser,
	updateUser,
	getUser,
	deleteUser,
};

export default user;
