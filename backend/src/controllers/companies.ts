import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { endpointWrapper } from '../middlewares/endpointWrapper.ts';
import * as z from 'zod';
import Company from '../models/Company.ts';
import companyUsecase from '../usecases/companies.ts';
import DomainError from '../models/DomainError.ts';

const companiesRouter = Router();

const CreateCompanyRequest = z.object({
  name: z.string().min(2),
});
companiesRouter.post(
  '',
  endpointWrapper(async function createCompany(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Company> {
    const { name } = CreateCompanyRequest.parse(request.body);
    const company = await companyUsecase.createCompany({
      accessToken: request.accessToken,
      name,
    });

    response.status(201);

    return company;
  }),
);

const UpdateCompanyRequest = z.object({
  name: z.string().min(2),
});
companiesRouter.patch(
  '/:companyId',
  endpointWrapper(async function updateCompany(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Company> {
    const companyId = request.params.companyId;
    if (!companyId) {
      throw new DomainError('validation-error');
    }
    const { name } = UpdateCompanyRequest.parse(request.body);
    const company = await companyUsecase.updateCompany({
      accessToken: request.accessToken,
      companyId,
      updates: {
        name,
      },
    });

    return company;
  }),
);

companiesRouter.get(
  '/:companyId',
  endpointWrapper(async function getCompany(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Company> {
    const companyId = request.params.companyId;
    if (!companyId) {
      throw new DomainError('validation-error');
    }
    const company = await companyUsecase.getCompany({
      accessToken: request.accessToken,
      companyId,
    });

    return company;
  }),
);

companiesRouter.delete(
  '/:companyId',
  endpointWrapper(async function deleteCompany(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    const companyId = request.params.companyId;
    if (!companyId) {
      throw new DomainError('validation-error');
    }
    const company = await companyUsecase.deleteCompany({
      accessToken: request.accessToken,
      companyId,
    });
  }),
);

export default companiesRouter;
