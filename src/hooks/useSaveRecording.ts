import { File, Paths } from "expo-file-system";
import { useState } from "react";

type CameraRecordingHandle = {
  recordAsync?: () => Promise<{ uri?: string } | undefined>;
  stopRecording?: () => void;
};

type CameraRecordingRef = {
  current: CameraRecordingHandle | null;
};

export function useSaveRecording() {
  const [savedUri, setSavedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopRecording = (cameraRef: CameraRecordingRef) => {
    if (!isRecording) return;
    setIsRecording(false);
    cameraRef.current?.stopRecording?.();
  };

  const saveRecording = async (cameraRef: CameraRecordingRef) => {
    try {
      setError(null);
      setIsRecording(true);
      const video = await cameraRef.current?.recordAsync?.();
      if (!video?.uri) return null;

      const tempFile = new File(video.uri); // cache file from CameraView
      const savedFile = new File(
        Paths.document,
        `teleprompter_${Date.now()}.mp4`,
      );

      tempFile.move(savedFile); // or tempFile.copy(savedFile) to keep cache copy
      setSavedUri(savedFile.uri);
      console.log("Saved video:", savedFile.uri);
      return savedFile.uri;
    } catch (caught) {
      console.error("Failed to save video:", caught);
      setError(
        caught instanceof Error ? caught.message : "Failed to save video.",
      );
      return null;
    } finally {
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    savedUri,
    saveRecordingError: error,
    saveRecording,
    stopRecording,
  };
}
