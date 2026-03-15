import { deleteScriptById } from "@/utils/apis";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteScript = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => {
      await deleteScriptById(id);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
      queryClient.invalidateQueries({ queryKey: ["script", id] });
    },
    onError: (error) => {
      console.error("Error deleting script:", error);
    },
  });

  return {
    deleteScript: mutate,
    deleteScriptAsync: mutateAsync,
    isDeleteScriptPending: isPending,
  };
};
