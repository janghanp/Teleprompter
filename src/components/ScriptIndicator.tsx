import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Activity, useEffect } from "react";

interface Props {
  currentScriptOverlayHeight: number;
  leftArrow: boolean;
  line: boolean;
  rightArrow: boolean;
}

export default function ScriptIndicator({
  currentScriptOverlayHeight,
  leftArrow,
  line,
  rightArrow,
}: Props) {
  const handleStartY = useSharedValue(0);
  const handleTranslateY = useSharedValue(0);
  const overlayHeight = useSharedValue(300);
  const handleHeight = 15;
  const handleBaseBottom = 50;

  useEffect(() => {
    if (currentScriptOverlayHeight) {
      overlayHeight.value = currentScriptOverlayHeight;
    }
  }, [currentScriptOverlayHeight]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      handleStartY.value = handleTranslateY.value;
    })
    .onUpdate((e) => {
      if (e.absoluteY < 150) {
        return;
      }

      const minTranslate = -(
        overlayHeight.value -
        handleBaseBottom -
        handleHeight
      );
      const maxTranslate = handleBaseBottom;
      const nextValue = handleStartY.value + e.translationY;
      handleTranslateY.value = Math.min(
        maxTranslate,
        Math.max(minTranslate, nextValue),
      );
    });

  const handleStyle = useAnimatedStyle(() => {
    const minTranslate = -(
      overlayHeight.value -
      handleBaseBottom -
      handleHeight
    );

    const clampedTranslate = Math.min(
      handleBaseBottom,
      Math.max(minTranslate, handleTranslateY.value),
    );

    return {
      transform: [{ translateY: clampedTranslate }],
    };
  });

  return (
    <>
      <Activity mode={leftArrow ? "visible" : "hidden"}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                left: 0,
                position: "absolute",
                bottom: handleBaseBottom - 17,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderTopWidth: 25,
                borderBottomWidth: 25,
                borderLeftWidth: 25,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "rgba(255, 255, 255, 0.45)",
                zIndex: 50,
              },
              handleStyle,
            ]}
          />
        </GestureDetector>
      </Activity>
      <Activity mode={line ? "visible" : "hidden"}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                left: 0,
                right: 0,
                bottom: handleBaseBottom,
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: handleHeight,
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                borderRadius: 10,
                zIndex: 50,
              },
              handleStyle,
            ]}
          />
        </GestureDetector>
      </Activity>
      <Activity mode={rightArrow ? "visible" : "hidden"}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                right: 0,
                position: "absolute",
                bottom: handleBaseBottom - 17,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderTopWidth: 25,
                borderBottomWidth: 25,
                borderRightWidth: 25,
                borderTopColor: "transparent",
                borderBottomColor: "transparent",
                borderRightColor: "rgba(255, 255, 255, 0.45)",
                zIndex: 50,
              },
              handleStyle,
            ]}
          />
        </GestureDetector>
      </Activity>
    </>
  );
}
