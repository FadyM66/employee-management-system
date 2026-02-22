import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

export function endpointWrapper(
	routeHandler: (
		request: ExpressRequest,
		response: ExpressResponse,
		next: NextFunction,
	) => Promise<Record<string, any> | void>,
) {
	return async (request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
		const result: Record<string, any> | void = await routeHandler(request, response, next);

		response.json(result);
	};
}
