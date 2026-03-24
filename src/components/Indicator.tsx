import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default function Indicator() {
  const handleStartY = useSharedValue(0);
  const handleTranslateY = useSharedValue(0);
  const overlayHeight = useSharedValue(300);
  const handleHeight = 8;
  const handleBaseBottom = 50;

  const pan = Gesture.Pan()
    .onBegin(() => {
      handleStartY.value = handleTranslateY.value;
    })
    .onUpdate((e) => {
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
            backgroundColor: "rgba(250, 128, 114, 0.45)",
            borderRadius: 10,
          },
          handleStyle,
        ]}
      />
    </GestureDetector>
  );
}