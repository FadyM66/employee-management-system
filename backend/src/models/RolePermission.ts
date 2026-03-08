import type Permission from './Permission.ts';
import type Role from './Role.ts';

export default interface RolePermission {
	id: string;
	roleId: Role['id'];
	permissionId: Permission['id'];
}
