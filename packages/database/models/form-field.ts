import { jsonb, varchar } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { form } from "./form";
import { uniqueIndex } from "drizzle-orm/pg-core";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const formFieldVariant = pgEnum("form_field_variant", [
  "short_text",
  "long_text",
  "email",
  "phone",
  "url",
  "number",
  "rating",
  "slider",
  "select",
  "multi_select",
  "radio",
  "checkbox",
  "boolean",
  "date",
  "file",
]);

export const formField = pgTable(
  "form_field",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .notNull()
      .references(() => form.id, { onDelete: "cascade" }),

    label: varchar("label", { length: 150 }).notNull(),
    labelKey: varchar("label_key", { length: 150 }).notNull(),

    description: text("description"),
    helpText: text("help_text"),
    placeholder: text("placeholder"),

    fieldType: formFieldVariant("field_type").notNull(),

    isRequired: boolean("is_required").notNull().default(false),
    isHidden: boolean("is_hidden").notNull().default(false),
    isDisabled: boolean("is_disabled").notNull().default(false),

    stepNumber: integer("step_number"),
    sortOrder: integer("sort_order").notNull().default(0),

    defaultValue: jsonb("default_value"),
    options: jsonb("options"),
    validation: jsonb("validation"),
    settings: jsonb("settings"),

    dependsOnFieldId: uuid("depends_on_field_id").references((): AnyPgColumn => formField.id, {
      onDelete: "set null",
    }),
    conditionalLogic: jsonb("conditional_logic"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    uniqueIndex("form_field_label_key_unique").on(table.formId, table.labelKey),
    index("form_field_form_id_idx").on(table.formId),
    index("form_field_depends_on_idx").on(table.dependsOnFieldId),
    uniqueIndex("form_field_name_unique_idx").on(table.formId, table.labelKey),
  ],
);

export const formFieldRelations = relations(formField, ({ one, many }) => ({
  form: one(form, {
    fields: [formField.formId],
    references: [form.id],
  }),

  dependsOn: one(formField, {
    fields: [formField.dependsOnFieldId],
    references: [formField.id],
    relationName: "field_dependency",
  }),

  dependentFields: many(formField, {
    relationName: "field_dependency",
  }),
}));
