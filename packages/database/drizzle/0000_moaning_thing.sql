CREATE TYPE "public"."form_status" AS ENUM('draft', 'published', 'archived', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."form_theme" AS ENUM('default', 'movie', 'terminal', 'startup', 'game', 'anime', 'os');--> statement-breakpoint
CREATE TYPE "public"."form_type" AS ENUM('single_step', 'multi_step');--> statement-breakpoint
CREATE TYPE "public"."form_field_variant" AS ENUM('short_text', 'long_text', 'email', 'phone', 'url', 'number', 'rating', 'slider', 'select', 'multi_select', 'radio', 'checkbox', 'boolean', 'date', 'file');--> statement-breakpoint
CREATE TYPE "public"."form_submission_status" AS ENUM('draft', 'submitted');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"theme" "form_theme" DEFAULT 'default' NOT NULL,
	"form_type" "form_type" DEFAULT 'single_step' NOT NULL,
	"created_by" text NOT NULL,
	"form_status" "form_status" DEFAULT 'draft' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"password" text,
	"max_submission_limit" integer DEFAULT 100,
	"form_expiry" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "form_field" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" varchar(150) NOT NULL,
	"label_key" varchar(150) NOT NULL,
	"description" text,
	"help_text" text,
	"placeholder" text,
	"field_type" "form_field_variant" NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"is_disabled" boolean DEFAULT false NOT NULL,
	"step_number" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"index" numeric NOT NULL,
	"default_value" jsonb,
	"options" jsonb,
	"validation" jsonb,
	"settings" jsonb,
	"depends_on_field_id" uuid,
	"conditional_logic" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"status" "form_submission_status" DEFAULT 'draft' NOT NULL,
	"resume_token" varchar(255),
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "form_submission_resume_token_unique" UNIQUE("resume_token")
);
--> statement-breakpoint
CREATE TABLE "form_response" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"field_snapshot" jsonb,
	"value" jsonb,
	"is_valid" boolean DEFAULT true NOT NULL,
	"validation_errors" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "form_response_submission_field_unique" UNIQUE("submission_id","field_id")
);
--> statement-breakpoint
CREATE TABLE "form_template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"form_id" uuid NOT NULL,
	"creator" text NOT NULL,
	"total_forks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form" ADD CONSTRAINT "form_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_depends_on_field_id_form_field_id_fk" FOREIGN KEY ("depends_on_field_id") REFERENCES "public"."form_field"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submission" ADD CONSTRAINT "form_submission_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_response" ADD CONSTRAINT "form_response_submission_id_form_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_response" ADD CONSTRAINT "form_response_field_id_form_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_field"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_template" ADD CONSTRAINT "form_template_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "form_slug_unique_idx" ON "form" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "form_created_by_idx" ON "form" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "form_status_idx" ON "form" USING btree ("form_status");--> statement-breakpoint
CREATE UNIQUE INDEX "form_field_label_key_unique" ON "form_field" USING btree ("form_id","label_key");--> statement-breakpoint
CREATE INDEX "form_field_form_id_idx" ON "form_field" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "form_field_depends_on_idx" ON "form_field" USING btree ("depends_on_field_id");--> statement-breakpoint
CREATE UNIQUE INDEX "form_field_name_unique_idx" ON "form_field" USING btree ("form_id","label_key");--> statement-breakpoint
CREATE INDEX "form_submission_form_id_idx" ON "form_submission" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "form_submission_status_idx" ON "form_submission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "form_submission_last_activity_idx" ON "form_submission" USING btree ("last_activity_at");--> statement-breakpoint
CREATE INDEX "form_submission_resume_token_idx" ON "form_submission" USING btree ("resume_token");--> statement-breakpoint
CREATE INDEX "form_response_submission_id_idx" ON "form_response" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "form_response_field_id_idx" ON "form_response" USING btree ("field_id");--> statement-breakpoint
CREATE INDEX "form_response_is_valid_idx" ON "form_response" USING btree ("is_valid");