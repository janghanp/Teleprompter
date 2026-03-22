import { useDeleteRecording } from "@/hooks/useDeleteRecording";
import { formatTime } from "@/utils";
import { RecordingItemType } from "@/utils/interfaces";
import {
  Button,
  ContextMenu,
  Host,
  RNHostView,
  VStack,
} from "@expo/ui/swift-ui";
import {
  aspectRatio,
  clipShape,
  onTapGesture,
} from "@expo/ui/swift-ui/modifiers";
import { useEvent } from "expo";
import { Image as ExpoImage } from "expo-image";
import { Album, Asset, requestPermissionsAsync } from "expo-media-library/next";
import { useRouter } from "expo-router";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

interface Props {
  item: RecordingItemType;
  onDeleted?: () => void;
}

export default function RecordingItem({ item, onDeleted }: Props) {
  const router = useRouter();
  const videoPlayer = useVideoPlayer(item.uri);
  const [liveThumbnail, setLiveThumbnail] = useState<string | null>(null);
  const { deleteRecording, isDeletingRecording } = useDeleteRecording();
  const { status } = useEvent(videoPlayer, "statusChange", {
    status: videoPlayer.status,
  });

  useEffect(() => {
    if (status == "readyToPlay") {
      loadThumbnail();
    }
  }, [status]);

  const loadThumbnail = async () => {
    try {
      const [thumb] = await videoPlayer.generateThumbnailsAsync(0.5);
      setLiveThumbnail(thumb as unknown as string);
    } catch (e) {
      console.warn("Thumbnail generation failed", e);
    }
  };

  const pressHandler = () => {
    router.push({
      pathname: "/(tabs)/recordings/[name]",
      params: { name: item.name },
    });
  };

  const deleteHandler = async () => {
    if (isDeletingRecording) return;

    Alert.alert(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteRecording(item.uri);
            onDeleted?.();
          },
        },
      ],
    );
  };

  const requestPhotosPermission = async () => {
    const { status } = await requestPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Permission not granted");
    }
  };

  const saveToPhotosHandler = async () => {
    await requestPhotosPermission();

    const asset = await Asset.create(item.uri);
    await Album.create("Teleprompter", [asset]);

    Alert.alert("Saved successfully!.");
  };

  return (
    <Host style={styles.host}>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Save to Photos"
            systemImage="photo"
            role="default"
            onPress={saveToPhotosHandler}
          />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={deleteHandler}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <VStack
            alignment="leading"
            modifiers={[
              aspectRatio({ ratio: 1, contentMode: "fit" }),
              clipShape("roundedRectangle", 11),
              onTapGesture(pressHandler),
            ]}
          >
            <RNHostView matchContents>
              <View style={styles.thumbnail}>
                {liveThumbnail ? (
                  <ExpoImage
                    source={liveThumbnail}
                    style={styles.thumbnail}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder} />
                )}
                <View style={styles.previewDuration}>
                  <Text style={styles.previewDurationText}>
                    {formatTime(videoPlayer.duration)}
                  </Text>
                </View>
              </View>
            </RNHostView>
          </VStack>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
    aspectRatio: 1,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f1f1f",
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
});
