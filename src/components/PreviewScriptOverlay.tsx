import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  fontSize: number;
  scrollSpeed: number;
  lineHeight: number;
  scriptBackgroundOpacity: number;
}

export default function PreviewScriptOverlay({
  fontSize,
  scrollSpeed,
  lineHeight,
  scriptBackgroundOpacity,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const fontSizeValue = 10 + fontSize * 4;
  const lineHeightValue = Math.round(fontSize * lineHeight);
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const isLandscape = width > height;
  const columnGap = 16;
  const halfWidth = isLandscape
    ? Math.max(0, (availableWidth - columnGap) / 2)
    : availableWidth;
  const overlayPositionStyle = isLandscape
    ? { left: insets.left, width: halfWidth }
    : { left: 0, right: 0 };
  const sliderPositionStyle = isLandscape
    ? { left: insets.left + halfWidth + columnGap, right: insets.right }
    : { left: 24, right: 24 };

  return (
    <View
      style={[
        styles.scriptOverlay,
        overlayPositionStyle,
        {
          maxHeight: isLandscape ? "100%" : "50%",
          top: isLandscape ? 10 : 20,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scriptScrollContent}
        scrollEventThrottle={16}
      >
        <Text style={[styles.scriptText, { fontSize, lineHeight }]}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of
          the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen
          book. It has survived not only five centuries, but also the leap into
          electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets
          containing Lorem Ipsum passages, and more recently with desktop
          publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F3F5",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  scriptScrollContent: {
    paddingBottom: 8, // breathing room at the bottom
  },
  scriptOverlay: {
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    maxHeight: "50%",
  },
  scriptText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
  },
  sliderHost: {
    position: "absolute",
    height: 60,
    bottom: 60,
  },
});
