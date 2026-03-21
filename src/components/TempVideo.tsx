import { Image } from "expo-image";
import { createVideoPlayer, type VideoThumbnail } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import TempVideoPreviewBottomSheet from "./TempVideoPreviewBottomSheet";

interface Props {
  tempVideoUri: string;
}

export default function TempVideo({ tempVideoUri }: Props) {
  const [thumbnail, setThumbnail] = useState<VideoThumbnail | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const player = createVideoPlayer(null);

    const loadThumbnail = async () => {
      try {
        await player.replaceAsync(tempVideoUri);
        const [thumb] = await player.generateThumbnailsAsync(0.5, {
          maxWidth: 240,
        });

        if (!cancelled) {
          setThumbnail(thumb ?? null);
        }
      } catch (error) {
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
    };
  }, [tempVideoUri]);

  const pressHandler = () => {
    setIsOpen(true);
  };

  return (
    <>
      <View style={styles.container}>
        {thumbnail ? (
          <Pressable onPress={pressHandler}>
            <Image source={thumbnail} style={styles.video} contentFit="cover" />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <TempVideoPreviewBottomSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        tempVideoUri={tempVideoUri}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f1f1f",
  },
});
