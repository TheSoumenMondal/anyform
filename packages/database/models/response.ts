import { pgTable, uuid, timestamp, jsonb, boolean, text, index, unique } from "drizzle-orm/pg-core";

import { formSubmission } from "./submission";
import { formField } from "./form-field";

export const formResponse = pgTable(
  "form_response",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .references(() => formSubmission.id, {
        onDelete: "cascade",
      })
      .notNull(),
    fieldId: uuid("field_id")
      .references(() => formField.id, {
        onDelete: "cascade",
      })
      .notNull(),

    fieldSnapshot: jsonb("field_snapshot"),
    value: jsonb("value"),

    isValid: boolean("is_valid").default(true).notNull(),
    validationErrors: jsonb("validation_errors"),

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
    unique("form_response_submission_field_unique").on(table.submissionId, table.fieldId),
    index("form_response_submission_id_idx").on(table.submissionId),
    index("form_response_field_id_idx").on(table.fieldId),
    index("form_response_is_valid_idx").on(table.isValid),
  ],
);
