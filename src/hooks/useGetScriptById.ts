import { getScriptById } from "@/utils/apis";
import { useQuery } from "@tanstack/react-query";

export function useGetScriptById(id?: number) {
  const isValidId = typeof id === "number" && !Number.isNaN(id);

  const { data, error, isLoading } = useQuery({
    queryKey: ["script", id],
    queryFn: () => getScriptById(id as number),
    enabled: isValidId,
  });

  return {
    script: data,
    isScriptLoading: isLoading,
    scriptError: error,
  };
}
