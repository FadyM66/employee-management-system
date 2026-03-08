ALTER TABLE "role-permission" RENAME TO "role_permission";--> statement-breakpoint
ALTER TABLE "role_permission" RENAME COLUMN "role" TO "role_id";--> statement-breakpoint
ALTER TABLE "role_permission" RENAME COLUMN "permission" TO "permission_id";--> statement-breakpoint
ALTER TABLE "role_permission" DROP CONSTRAINT "role-permission_role_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "role_permission" DROP CONSTRAINT "role-permission_permission_permissions_id_fk";
--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE no action ON UPDATE no action;