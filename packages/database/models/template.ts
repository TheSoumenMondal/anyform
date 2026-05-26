import { pgTable, varchar, text, uuid, timestamp, integer } from "drizzle-orm/pg-core";
import { form } from "./form";
import { user } from "./auth";

export const formTemplate = pgTable("form_template", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  formId: uuid("form_id")
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  creator: text("creator")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  totalForks: integer("total_forks").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
