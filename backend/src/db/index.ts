import './instance.ts';
import * as users from './users.ts';
import * as roles from './roles.ts';
import * as companies from './companies.ts';
import * as departments from './departments.ts';
import * as employees from './employees.ts';

const db = {
	users,
	roles,
	companies,
	departments,
	employees,
};

export default db;
