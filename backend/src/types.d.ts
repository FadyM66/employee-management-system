import 'express';

declare module 'express' {
	export interface Request {
		accessToken?: string | undefined;
		auth?: {
			userId?: string;
			roleId?: string;
			email?: string;
		};
	}
}
