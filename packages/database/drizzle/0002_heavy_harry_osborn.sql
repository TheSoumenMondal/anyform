ALTER TABLE "form_template" DROP CONSTRAINT "form_template_form_id_form_id_fk";
--> statement-breakpoint
ALTER TABLE "form_template" DROP CONSTRAINT "form_template_creator_user_id_fk";
--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;