import express, {
  json,
  urlencoded,
  type Request as ExpressRequest,
  type Response as ExpressResponse,
  type NextFunction,
} from 'express';
import cors from 'cors';
import router from './controllers/index.ts';
import DomainError from './models/DomainError.ts';
import * as z from 'zod';

const port = parseInt(process.env.PORT!) || 3000;

const app = express();

app.use(
  cors({
    origin: true,
  }),
);

app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(
  json({
    strict: true,
    verify: (_request, _response, buffer, encoding) => {
      try {
        JSON.parse(buffer.toString(encoding as BufferEncoding));
      } catch {
        throw new DomainError('malformed-input');
      }
    },
  }),
);

app.use(router);

app.use((_request: ExpressRequest, response: ExpressResponse) => {
  response.status(404).send();
});

app.use(function globalErrorHandler(
  error: unknown,
  _request: ExpressRequest,
  response: ExpressResponse,
  _next: NextFunction,
) {
  if (error instanceof z.ZodError) {
    const errorPaths = error.issues.map((e) => e.path.join('.'));
    const validationError = new DomainError('validation-error', {
      error: 'invalid inputs',
      invalidFields: errorPaths,
    });

    return response.status(422).json(validationError);
  }

  if (!(error instanceof DomainError) || error.isInternal) {
    console.error('=============== Internal Error ===============');
    console.error(error);
    console.error('==============================================');
    const internalError = new DomainError('internal-error');

    return response.status(500).json(internalError);
  }

  switch (error.code) {
    case 'validation-error':
      response.status(422);
      break;
    case 'malformed-input':
      response.status(400);
      break;
    case 'invalid-credentials':
      response.status(401);
      break;
    case 'internal-error':
      response.status(500);
      break;
    case 'not-found':
      response.status(404);
      break;
    case 'conflict-error':
      response.status(409);
      break;
    case 'authentication-required':
      response.status(401);
      break;
    default:
      return error.code satisfies never;
  }

  return response.json({
    code: error.code,
    details: error.details,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
