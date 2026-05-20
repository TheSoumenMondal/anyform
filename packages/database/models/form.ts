import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { integer } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const formStatus = pgEnum("form_status", ["draft", "published", "archived", "deleted"]);

export const form = pgTable("form", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
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
});

export const formRelations = relations(form, ({ one }) => ({
  creator: one(user, {
    fields: [form.createdBy],
    references: [user.id],
  }),
}));
