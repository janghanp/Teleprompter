import { updateScriptById } from "@/utils/apis";
import { UpdateScriptInput } from "@/utils/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateScript() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (newScript: UpdateScriptInput) => {
      await updateScriptById(newScript);
    },
    onSuccess: (_data, newScript) => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      queryClient.invalidateQueries({ queryKey: ["script", newScript.id] });
    },
    onError: (error) => {
      console.error("Error updating script:", error);
    },
  });

  return {
    updateScript: mutate,
    updateScriptAsync: mutateAsync,
    isUpdateScriptPending: isPending,
  };
}
