import { insertScript } from "@/utils/apis";
import { CreateScriptInput } from "@/utils/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateScript() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (newScript: CreateScriptInput) => {
      await insertScript(newScript);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
    onError: (error) => {
      console.error("Error creating script:", error);
    },
  });

  return {
    createScript: mutate,
    createScriptAsync: mutateAsync,
    isCreateScriptPending: isPending,
  };
}
