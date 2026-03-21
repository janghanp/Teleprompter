import { useDeleteRecording } from "@/hooks/useDeleteRecording";
import { RecordingItemType } from "@/utils/interfaces";
import { Button, ContextMenu, Host, VStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  background,
  clipShape,
  frame,
  onTapGesture,
  padding,
  shapes,
} from "@expo/ui/swift-ui/modifiers";
import { Image as ExpoImage } from "expo-image";
import { Album, Asset, requestPermissionsAsync } from "expo-media-library/next";
import { useRouter } from "expo-router";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

interface Props {
  item: RecordingItemType;
  onDeleted?: () => void;
}

export default function RecordingItem({ item, onDeleted }: Props) {
  const router = useRouter();
  const player = useVideoPlayer(item.uri);
  const [liveThumbnail, setLiveThumbnail] = useState<string | null>(null);
  const { deleteRecording, isDeletingRecording } = useDeleteRecording();

  useEffect(() => {
    const test = async () => {
      try {
        const [thumb] = await player.generateThumbnailsAsync(0.5);
        setLiveThumbnail(thumb as unknown as string);
      } catch (e) {
        console.warn("Thumbnail generation failed", e);
      }
    };

    test();
  }, [player, item.thumbnail]);

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
    <Host matchContents>
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
              padding({ all: 8 }),
              frame({ width: 100, height: 100, alignment: "topLeading" }),
              background(
                "white",
                shapes.roundedRectangle({ cornerRadius: 11 }),
              ),
              aspectRatio({ ratio: 1, contentMode: "fit" }),
              clipShape("roundedRectangle", 11),
              onTapGesture(pressHandler),
            ]}
          >
            {liveThumbnail ? (
              <ExpoImage
                source={liveThumbnail}
                style={styles.thumbnail}
                contentFit="cover"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder} />
            )}
          </VStack>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f1f1f",
  },
});
