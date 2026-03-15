export interface CreateScriptInput {
  title: string;
  content?: string;
}

export interface Script {
  id: number;
  title: string;
  content: string | null;
  createdAt: number;
  updatedAt: number;
}
