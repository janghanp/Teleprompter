import { db } from "@/app";
import { scriptsTable } from "../../db/schema";
import { CreateScriptInput } from "./interfaces";

export async function insertScript(scriptInput: CreateScriptInput) {
  const result = await db.insert(scriptsTable).values({
    title: scriptInput.title || "Untitled Script",
    content: scriptInput.content || "",
  });

  return result.lastInsertRowId;
}

export async function getAllScripts() {
  const scripts = await db.select().from(scriptsTable);

  return scripts;
}
