import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const scriptsTable = sqliteTable("scripts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: integer("createdAt", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updatedAt", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdateFn(() => sql`(unixepoch())`),
});