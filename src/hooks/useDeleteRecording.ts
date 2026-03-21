import { File } from "expo-file-system";
import { useCallback, useState } from "react";

export function useDeleteRecording() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRecording = useCallback(async (uri: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const file = new File(uri);

      if (file.exists) {
        file.delete();
      }

      return true;
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Failed to delete recording.",
      );
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    deleteRecording,
    deleteRecordingError: error,
    isDeletingRecording: isDeleting,
  };
}
