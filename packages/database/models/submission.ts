import { pgTable, uuid, timestamp, pgEnum, varchar, index } from "drizzle-orm/pg-core";
import { form } from "./form";
export const formSubmissionStatus = pgEnum("form_submission_status", ["draft", "submitted"]);

export const formSubmission = pgTable(
  "form_submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .references(() => form.id, {
        onDelete: "cascade",
      })
      .notNull(),
    status: formSubmissionStatus("status").notNull().default("draft"),

    resumeToken: varchar("resume_token", {
      length: 255,
    }).unique(),

    lastActivityAt: timestamp("last_activity_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("form_submission_form_id_idx").on(table.formId),
    index("form_submission_status_idx").on(table.status),
    index("form_submission_last_activity_idx").on(table.lastActivityAt),
    index("form_submission_resume_token_idx").on(table.resumeToken),
  ],
);
