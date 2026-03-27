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
import { asyncStorage } from "@/app";

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
  const overlayHeight = useSharedValue(300);
  const startHeight = useSharedValue(300);
  const overlayXCoordinate = useSharedValue(0);
  const overlayYCoordinate = useSharedValue(0);
  const [indicatorValue0, setIndicatorValue0] = useState(false);
  const [indicatorValue1, setIndicatorValue1] = useState(false);
  const [indicatorValue2, setIndicatorValue2] = useState(false);
  const [currentScriptOverlayHeight, setCurrentScriptOverlayHeight] =
    useState(300);

  useEffect(() => {
    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle0",
      );

      setIndicatorValue0(!!indicatorValueFromAsync);
    })();

    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle1",
      );

      setIndicatorValue1(!!indicatorValueFromAsync);
    })();

    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle2",
      );

      setIndicatorValue2(!!indicatorValueFromAsync);
    })();
  }, []);

  // reset the overlay position whenever the screen mode is changed.
  useEffect(() => {
    if (width && height) {
      overlayXCoordinate.value = 0;
      overlayYCoordinate.value = 0;
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
    })
    .onUpdate((e) => {
      overlayHeight.value = Math.max(
        100,
        Math.min(startHeight.value + e.translationY, 800),
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

    if (isLandscape) {
      const leftXPosition = insets.left + 20;
      const rightXPosition = (width - insets.right) / 1.5;

      if (e.absoluteX < leftXPosition || e.absoluteX > rightXPosition) {
        return;
      }

      overlayXCoordinate.value += e.changeX;
    }

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
          overlayContainerStyle,
          {
            ...overlayPositionStyle,
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
          leftArrow={indicatorValue0}
          line={indicatorValue1}
          rightArrow={indicatorValue2}
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
