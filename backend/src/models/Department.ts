import Employee from './Employee.ts';

export default interface Department {
	id: string;
	name: string;
	companyId: string;
	head: Employee['id'];
}
