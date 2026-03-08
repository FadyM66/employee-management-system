import { eq } from 'drizzle-orm';
import type Permission from '../models/Permission.ts';
import type RolePermission from '../models/RolePermission.ts';
import db from './instance.ts';
import * as schemas from './schema.ts';

export async function insert(
	roleId: RolePermission['roleId'],
	permissionId: RolePermission['permissionId'],
): Promise<RolePermission | null> {
	const [rolePermission] = await db.insert(schemas.rolePermissions).values({ roleId, permissionId }).returning({
		id: schemas.rolePermissions.id,
		roleId: schemas.rolePermissions.roleId,
		permissionId: schemas.rolePermissions.permissionId,
	});

	return rolePermission || null;
}

export async function getById(id: RolePermission['id']): Promise<RolePermission | null> {
	const [rolePermission] = await db
		.select({
			id: schemas.rolePermissions.id,
			roleId: schemas.rolePermissions.roleId,
			permissionId: schemas.rolePermissions.permissionId,
		})
		.from(schemas.rolePermissions)
		.where(eq(schemas.rolePermissions.id, id));

	return rolePermission || null;
}

interface UpdateParameters {
	id: RolePermission['id'];
	updates: {
		roleId?: RolePermission['roleId'];
		permissionId?: RolePermission['permissionId'];
	};
}
export async function update({ id, updates }: UpdateParameters): Promise<RolePermission | null> {
	const [rolePermission] = await db
		.update(schemas.rolePermissions)
		.set(updates)
		.where(eq(schemas.rolePermissions.id, id))
		.returning({
			id: schemas.rolePermissions.id,
			roleId: schemas.rolePermissions.roleId,
			permissionId: schemas.rolePermissions.permissionId,
		});

	return rolePermission || null;
}

interface DeleteByIdParameters {
	id: RolePermission['id'];
}
export async function deleteById({ id }: DeleteByIdParameters): Promise<boolean> {
	const rolePermission = await db
		.delete(schemas.rolePermissions)
		.where(eq(schemas.rolePermissions.id, id))
		.returning({ id: schemas.rolePermissions.id });

	return rolePermission.length > 0;
}

export async function getPermissionNamesByRoleId(
	roleId: RolePermission['roleId'],
): Promise<Array<Permission['name']>> {
	const permissionNames = await db
		.select({
			name: schemas.permissions.name,
		})
		.from(schemas.rolePermissions)
		.innerJoin(schemas.permissions, eq(schemas.rolePermissions.permissionId, schemas.permissions.id))
		.where(eq(schemas.rolePermissions.roleId, roleId));

	return permissionNames.map((permission) => permission.name);
}
