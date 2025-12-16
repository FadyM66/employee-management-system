import { date, pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const employeeStatus = pgEnum('employee_status', [
  'application_received',
  'interview_scheduled',
  'hired',
  'not_accepted',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').unique().notNull(),
  password: varchar('password').notNull(),
  role: uuid('role')
    .notNull()
    .references(() => roles.id),
});

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').unique().notNull(),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').unique().notNull(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id),
  head: uuid('head')
    .notNull()
    .references(() => employees.id),
});

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email').unique().notNull(),
  name: varchar('name').notNull(),
  designation: varchar('designation').notNull(),
  status: employeeStatus('status').notNull().default('application_received'),
  mobile: varchar('mobile'),
  address: varchar('address'),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id),
  departmentId: uuid('department_id')
    .notNull()
    .references(() => departments.id),
  hiredOn: date('hired_on'),
});

// employee, manager, admin
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').unique().notNull(),
});

// read, add, edit, delete
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name').unique().notNull(),
});

export const role_permission = pgTable('role-permission', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: uuid('role')
    .notNull()
    .references(() => roles.id),
  permission: uuid('permission')
    .notNull()
    .references(() => permissions.id),
});
