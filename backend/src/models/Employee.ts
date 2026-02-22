export type EmployeeStatus = 'application_received' | 'interview_scheduled' | 'hired' | 'not_accepted';

export default interface Employee {
	id: string;
	email: string;
	name: string;
	designation: string;
	status: EmployeeStatus;
	mobile: string | null;
	address: string | null;
	companyId: string;
	departmentId: string;
	hiredOn: Date | null;
}
