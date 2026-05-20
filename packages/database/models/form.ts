import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid, index } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { integer } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core";

export const formStatus = pgEnum("form_status", ["draft", "published", "archived", "deleted"]);
export const formType = pgEnum("form_type", ["single_step", "multi_step"]);

export const form = pgTable(
  "form",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    formType: formType("form_type").default("single_step").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => user.id),
    formStatus: formStatus("form_status").default("draft").notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    isProtected: boolean("is_protected").notNull().default(false),
    password: text("password"),
    maxSubmissionLimit: integer("max_submission_limit").default(100),
    expiry: timestamp("form_expiry").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("form_slug_unique_idx").on(table.slug),
    index("form_created_by_idx").on(table.createdBy),
    index("form_status_idx").on(table.formStatus),
  ],
);

export const formRelations = relations(form, ({ one }) => ({
  creator: one(user, {
    fields: [form.createdBy],
    references: [user.id],
  }),
}));
