import type Company from './Company.ts';
import type Employee from './Employee.ts';

export default interface Department {
	id: string;
	name: string;
	companyId: Company['id'];
	head: Employee['id'] | null;
}
