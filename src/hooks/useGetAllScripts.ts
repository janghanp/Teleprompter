import { getAllScripts } from "@/utils/apis";
import { useQuery } from "@tanstack/react-query";

export function useGetAllScripts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["scripts"],
    queryFn: getAllScripts,
  });

  return {
    scripts: data,
    isScriptsLoading: isLoading,
    scriptsError: error,
  };
}
