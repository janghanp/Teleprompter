import Ionicons from "@expo/vector-icons/Ionicons";
import { useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Indicator from "@/components/Indicator";

interface Props {
  script: string;
  fontSize: number;
  lineHeight: number;
}

export default function ScriptOverlay({ script, fontSize, lineHeight }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const { width, height } = useWindowDimensions();
  const overlayHeight = useSharedValue(300);
  const startHeight = useSharedValue(300);
  const overlayStyle = useAnimatedStyle(() => ({
    height: overlayHeight.value,
  }));

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = overlayHeight.value;
    })
    .onUpdate((e) => {
      overlayHeight.value = Math.max(
        100,
        Math.min(startHeight.value + e.translationY, 800),
      );
    });

  const isLandscape = width > height;
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const overlayWidth = isLandscape ? availableWidth / 2 : availableWidth;
  const overlayPositionStyle = isLandscape
    ? { left: insets.left, width: overlayWidth }
    : { left: 0, right: 0 };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
      <Animated.View
        style={[
          styles.scriptOverlay,
          overlayStyle,
          {
            ...overlayPositionStyle,
            top: isLandscape ? 10 : 30,
            height: "auto",
            maxHeight: isLandscape ? "95%" : "70%",
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scriptScrollContent}
          scrollEventThrottle={16}
          onScroll={handleScriptScroll}
        >
          <Text style={[styles.scriptText, { fontSize, lineHeight }]}>
            {script}
          </Text>
        </ScrollView>
        <GestureDetector gesture={pan}>
          <View
            style={{
              right: 4,
              bottom: 4,
              position: "absolute",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              borderRadius: 10,
            }}
          >
            <Pressable>
              <Ionicons name="resize" size={35} color={"white"} />
            </Pressable>
          </View>
        </GestureDetector>
        <Indicator />
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  scriptScrollContent: {
    paddingBottom: 8, // breathing room at the bottom
  },
  scriptOverlay: {
    position: "absolute",
    top: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    height: 300,
    maxHeight: "50%",
  },
  scriptText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
  },
});
