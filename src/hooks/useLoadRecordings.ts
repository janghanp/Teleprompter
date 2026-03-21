import { RecordingItemType } from "@/utils/interfaces";
import { Directory, File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { createVideoPlayer, type VideoThumbnail } from "expo-video";
import { useCallback, useRef, useState } from "react";

export function useLoadRecordings() {
  const [recordings, setRecordings] = useState<RecordingItemType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadIdRef = useRef(0);

  const loadRecordings = useCallback(async () => {
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

      const player = createVideoPlayer(null);
      const thumbnailsByUri = new Map<string, VideoThumbnail>();

      try {
        for (const video of videos) {
          try {
            await player.replaceAsync(video.uri);
            const [thumbnail] = await player.generateThumbnailsAsync(0.5, {
              maxWidth: 240,
            });
            if (thumbnail) {
              thumbnailsByUri.set(video.uri, thumbnail);
            }
          } catch (thumbnailError) {
            console.warn("Failed to generate thumbnail", thumbnailError);
          }
        }
      } finally {
        player.release();
      }

      if (loadId !== loadIdRef.current) return;
      setRecordings((previous) =>
        previous.map((recording) => ({
          ...recording,
          thumbnail:
            thumbnailsByUri.get(recording.uri) ?? recording.thumbnail ?? null,
        })),
      );
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadRecordings();
    }, [loadRecordings]),
  );

  return {
    recordings,
    recordingsError: error,
    isRecordingsLoading: isLoading,
    loadRecordings,
  };
}
