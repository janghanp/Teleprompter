import Ionicons from "@expo/vector-icons/Ionicons";
import { RefObject, useEffect, useState } from "react";
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
import { runOnJS } from "react-native-worklets";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScriptIndicator from "@/components/ScriptIndicator";
import { useMMKVBoolean } from "react-native-mmkv";

interface Props {
  script: string;
  fontSize: number;
  lineHeight: number;
  backgroundOpacity: number;
  scrollRef: RefObject<ScrollView | null>;
  scrollY: RefObject<number>;
}

export default function ScriptOverlay({
  script,
  fontSize,
  lineHeight,
  backgroundOpacity,
  scrollRef,
  scrollY,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const scriptOverlayInitialWidth = isLandscape
    ? availableWidth / 2
    : availableWidth;

  const overlayHeight = useSharedValue(300);
  const overlayWidth = useSharedValue(scriptOverlayInitialWidth);
  const startHeight = useSharedValue(300);
  const startWidth = useSharedValue(scriptOverlayInitialWidth);
  const overlayXCoordinate = useSharedValue(0);
  const overlayYCoordinate = useSharedValue(0);
  const [MMKVScriptIndicatorStyle0] = useMMKVBoolean("scriptIndicatorStyle0");
  const [MMKVScriptIndicatorStyle1] = useMMKVBoolean("scriptIndicatorStyle1");
  const [MMKVScriptIndicatorStyle2] = useMMKVBoolean("scriptIndicatorStyle2");

  const [currentScriptOverlayHeight, setCurrentScriptOverlayHeight] =
    useState(300);

  // reset the overlay position whenever the screen mode is changed.
  useEffect(() => {
    if (width && height) {
      const isLandscape = width > height;

      overlayXCoordinate.value = 0;
      overlayYCoordinate.value = 0;

      overlayHeight.value = 300;
      overlayWidth.value = isLandscape ? width / 2 : width;
    }
  }, [width, height]);

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const resizePan = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = overlayHeight.value;
      startWidth.value = overlayWidth.value;
    })
    .onUpdate((e) => {
      overlayHeight.value = Math.max(
        100,
        Math.min(startHeight.value + e.translationY, 800),
      );

      overlayWidth.value = Math.min(
        Math.min(startWidth.value + e.translationX),
        width - insets.right - 20,
      );
    })
    .onEnd((e) => {
      const currentHeight = Math.max(
        100,
        Math.min(startHeight.value + e.translationY, 800),
      );

      runOnJS(setCurrentScriptOverlayHeight)(currentHeight);
    });

  const movePan = Gesture.Pan().onChange((e) => {
    const isLandscape = width > height;

    // if (isLandscape) {
    const leftXPosition = insets.left + 20;
    const rightXPosition = (width - insets.right) / 1.5;

    if (e.absoluteX < leftXPosition || e.absoluteX > rightXPosition) {
      return;
    }

    overlayXCoordinate.value += e.changeX;
    // }

    const topYPosition = (height - insets.top) * 0.4;
    const bottomYPosition =
      (height - insets.bottom) * (isLandscape ? 0.95 : 0.9);

    if (e.absoluteY > bottomYPosition || e.absoluteY < topYPosition) {
      return;
    }

    overlayYCoordinate.value += e.changeY;
  });

  const overlayStyle = useAnimatedStyle(() => ({
    height: overlayHeight.value,
    width: overlayWidth.value,
  }));

  const overlayContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: overlayXCoordinate.value,
        },
        {
          translateY: overlayYCoordinate.value,
        },
      ],
    };
  });

  const overlayBackgroundColor = `rgba(0, 0, 0, ${backgroundOpacity * 0.1})`;

  return (
    <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
      <Animated.View
        style={[
          styles.scriptOverlay,
          overlayStyle,
          overlayContainerStyle,
          {
            // ...overlayPositionStyle,
            left: insets.left,
            top: isLandscape ? 10 : 30,
            height: 300,
            maxHeight: isLandscape ? "95%" : "70%",
            backgroundColor: overlayBackgroundColor,
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
        <GestureDetector gesture={movePan}>
          <View
            style={{
              left: 4,
              bottom: 4,
              position: "absolute",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              borderRadius: 10,
              zIndex: 10,
            }}
          >
            <Pressable>
              <Ionicons name="move" size={30} color={"white"} />
            </Pressable>
          </View>
        </GestureDetector>

        <GestureDetector gesture={resizePan}>
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
              zIndex: 10,
            }}
          >
            <Pressable>
              <Ionicons name="resize" size={30} color={"white"} />
            </Pressable>
          </View>
        </GestureDetector>

        <ScriptIndicator
          currentScriptOverlayHeight={currentScriptOverlayHeight}
          leftArrow={MMKVScriptIndicatorStyle0 ?? false}
          line={MMKVScriptIndicatorStyle1 ?? false}
          rightArrow={MMKVScriptIndicatorStyle2 ?? false}
        />
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
    borderRadius: 12,
    padding: 16,
    height: 300,
    maxHeight: "70%",
    zIndex: 50,
  },
  scriptText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
  },
});
