import { RecordingItemType } from "@/utils/interfaces";
import { Directory, File, Paths } from "expo-file-system";
import { useEffect, useRef, useState } from "react";

export function useLoadRecordings() {
  const [recordings, setRecordings] = useState<RecordingItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);

  const loadRecordings = () => {
    const loadId = ++loadIdRef.current;
    setIsLoading(true);

    try {
      setError(null);
      const directory = new Directory(Paths.document);
      if (!directory.exists) {
        if (loadId === loadIdRef.current) {
          setRecordings([]);
        }
        return;
      }

      const contents = directory.list();

      const files = contents.filter(
        (item): item is File => item instanceof File,
      );

      const videos: RecordingItemType[] = files
        .filter(
          (file) =>
            file.name.startsWith("teleprompter_") && file.extension === ".mp4",
        )
        .map((file) => ({
          name: file.name,
          uri: file.uri,
          size: file.size ?? null,
          modified: file.modificationTime ?? null,
          thumbnail: null,
        }))
        .sort((a, b) => (b.modified ?? 0) - (a.modified ?? 0));

      if (loadId !== loadIdRef.current) return;
      setRecordings(videos);

      if (videos.length === 0) return;
    } catch (caught) {
      if (loadId !== loadIdRef.current) return;
      setRecordings([]);
      setError(
        caught instanceof Error ? caught.message : "Failed to load recordings.",
      );
    } finally {
      if (loadId === loadIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  return {
    recordings,
    recordingsError: error,
    isRecordingsLoading: isLoading,
    loadRecordings,
  };
}
