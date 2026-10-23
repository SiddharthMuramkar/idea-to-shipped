CREATE TABLE "answers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "answers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"visitor_id" uuid NOT NULL,
	"lesson_slug" text NOT NULL,
	"question_id" text NOT NULL,
	"option_id" text NOT NULL,
	"correct" boolean NOT NULL,
	"attempt_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_attempts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"visitor_id" uuid NOT NULL,
	"lesson_slug" text NOT NULL,
	"score" smallint NOT NULL,
	"total" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_attempt_id_test_attempts_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."test_attempts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_lesson_question_visitor_id_idx" ON "answers" USING btree ("lesson_slug","question_id","visitor_id","id");--> statement-breakpoint
CREATE INDEX "answers_visitor_lesson_id_idx" ON "answers" USING btree ("visitor_id","lesson_slug","id");--> statement-breakpoint
CREATE INDEX "test_attempts_visitor_lesson_created_at_idx" ON "test_attempts" USING btree ("visitor_id","lesson_slug","created_at");