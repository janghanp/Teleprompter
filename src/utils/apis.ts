import { db } from "@/app";
import { desc, eq } from "drizzle-orm";
import { scriptsTable } from "../../db/schema";
import { CreateScriptInput, UpdateScriptInput } from "./interfaces";

export async function insertScript(scriptInput: CreateScriptInput) {
  const result = await db.insert(scriptsTable).values({
    title: scriptInput.title || "Untitled Script",
    content: scriptInput.content || "",
  });

  return result.lastInsertRowId;
}

export async function getAllScripts() {
  const scripts = await db
    .select()
    .from(scriptsTable)
    .orderBy(desc(scriptsTable.createdAt));

  return scripts;
}

export async function getScriptById(id: number) {
  const script = await db
    .select()
    .from(scriptsTable)
    .where(eq(scriptsTable.id, id));

  return script;
}

export async function deleteScriptById(id: number) {
  const result = await db.delete(scriptsTable).where(eq(scriptsTable.id, id));

  return result;
}

export async function updateScriptById(newScript: UpdateScriptInput) {
  const result = await db
    .update(scriptsTable)
    .set({
      id: newScript.id,
      title: newScript.title,
      content: newScript.content,
    })
    .where(eq(scriptsTable.id, newScript.id));

  return result;
}
