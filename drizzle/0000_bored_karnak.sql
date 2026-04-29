CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"idea" text NOT NULL,
	"result" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
