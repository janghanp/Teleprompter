import { BottomSheet, Group, Host, RNHostView } from "@expo/ui/swift-ui";
import { presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
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

  return (
    <Host>
      <BottomSheet isPresented={isOpen} onIsPresentedChange={setIsOpen}>
        <Group modifiers={[presentationDragIndicator("visible")]}>
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 24,
    width: 300,
  },
  video: {
    width: 300,
    height: 600,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});
