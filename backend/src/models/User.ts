import type Role from './Role.ts';

export default interface User {
	id: string;
	email: string;
	hashedPassword: string;
	role: Role['id'];
}
