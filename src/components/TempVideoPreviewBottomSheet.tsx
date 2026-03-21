import { BottomSheet, Group, Host, RNHostView } from "@expo/ui/swift-ui";
import {
  glassEffect,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { useVideoPlayer, VideoView } from "expo-video";
import { Dispatch } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
  tempVideoUri: string;
}

export default function TempVideoPreviewBottomSheet({
  isOpen,
  setIsOpen,
  tempVideoUri,
}: Props) {
  const player = useVideoPlayer(tempVideoUri, (instance) => {
    instance.play();
  });

  console.log(tempVideoUri);

  return (
    <Host style={{ flex: 1 }}>
      <BottomSheet isPresented={isOpen} onIsPresentedChange={setIsOpen}>
        <Group
          modifiers={[
            glassEffect({
              glass: { variant: "regular", tint: "#ffffff55" },
              shape: "roundedRectangle",
              cornerRadius: 16,
            }),
            presentationDragIndicator("visible"),
          ]}
        >
          <RNHostView matchContents>
            <View style={styles.sheetContent}>
              <VideoView
                style={styles.video}
                player={player}
                allowsPictureInPicture={false}
                contentFit="contain"
              />
            </View>
          </RNHostView>
        </Group>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 24,
    backgroundColor: "transparent",
  },
  video: {
    width: 250,
    height: 500,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});
