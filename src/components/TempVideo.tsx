import TempVideoPreviewBottomSheet from "@/components/TempVideoPreviewBottomSheet";
import { formatTime } from "@/utils";
import { Image } from "expo-image";
import { createVideoPlayer, type VideoThumbnail } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  tempVideoUri: string;
}

export default function TempVideo({ tempVideoUri }: Props) {
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const player = createVideoPlayer(null);

    const loadThumbnail = async () => {
      try {
        await player.replaceAsync(tempVideoUri);

        console.log({ tempVideoUri });

        const [thumb] = await player.generateThumbnailsAsync(0.5, {
          maxWidth: 240,
        });

        console.log({ thumb });

        if (!cancelled) {
          setThumbnail(thumb ?? null);
          setDuration(Math.round(player.duration));
        }
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          setThumbnail(null);
        }
        console.warn("Failed to generate temp thumbnail", error);
      } finally {
        player.release();
      }
    };

    void loadThumbnail();

    return () => {
      cancelled = true;
      player.release();
    };
  }, [tempVideoUri]);

  const pressHandler = () => {
    setIsOpen(true);
  };

  return (
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
  );
}

const styles = StyleSheet.create({
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
