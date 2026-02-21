import './instance.ts';
import * as users from './users.ts';
import * as roles from './roles.ts';
import * as companies from './companies.ts';

const db = {
  users,
  roles,
  companies,
};

export default db;
