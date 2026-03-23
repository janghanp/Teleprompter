import TempVideoPreviewBottomSheet from "@/components/TempVideoPreviewBottomSheet";
import { formatTime } from "@/utils";
import { useEvent } from "expo";
import { Image } from "expo-image";
import { useVideoPlayer, type VideoThumbnail } from "expo-video";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  tempVideoUri: string;
}

export default function RecordingPreview({ tempVideoUri }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const videoPlayer = useVideoPlayer(tempVideoUri);
  const { status } = useEvent(videoPlayer, "statusChange", {
    status: videoPlayer.status,
  });

  useEffect(() => {
    if (tempVideoUri && status == "readyToPlay") {
      void loadThumbnail();
    }
  }, [status, tempVideoUri]);

  const loadThumbnail = async () => {
    try {
      const [thumb] = await videoPlayer.generateThumbnailsAsync(0.5, {
        maxWidth: 240,
      });

      setThumbnail(thumb);
      setDuration(Math.round(videoPlayer.duration));
    } catch (error) {
      console.log(error);

      console.warn("Failed to generate temp thumbnail", error);
    }
  };

  const pressHandler = () => {
    setIsOpen(true);
  };

  const isLandscape = width > height;
  const leftMargin = insets.left + (isLandscape ? 0 : 16);

  return (
    <View style={[styles.tempVideoWrapper, { left: leftMargin }]}>
      <View style={styles.container}>
        {thumbnail ? (
          <Pressable onPress={pressHandler}>
            <Image source={thumbnail} style={styles.video} contentFit="cover" />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.previewDuration}>
          <Text style={styles.previewDurationText}>{formatTime(duration)}</Text>
        </View>
        <TempVideoPreviewBottomSheet
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          tempVideoUri={tempVideoUri}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tempVideoWrapper: {
    position: "absolute",
    left: 16,
    bottom: 16,
    zIndex: 5,
  },
  container: {
    position: "relative",
    width: 112,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  previewDuration: {
    width: "60%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTopLeftRadius: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 0,
    bottom: 0,
    padding: 2,
  },
  previewDurationText: {
    fontSize: 16,
    color: "white",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f1f1f",
  },
});
