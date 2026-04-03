import {
  useAudioRecorder,
  RecordingPresets,
  useAudioRecorderState,
  AudioModule,
  setAudioModeAsync,
} from "expo-audio";
import { useEffect } from "react";
import { Alert, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 130,
  mass: 0.5,
};

interface Props {
  isRecording: boolean;
}

export default function VolumeMeter({ isRecording }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const fillPercent = useSharedValue(0);
  const isLandscape = width > height;

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
      setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true })
        .then(async () => {
          await recorder.prepareToRecordAsync({ isMeteringEnabled: true });
        })
        .catch(console.error);
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      void recorder.record();
    } else {
      void recorder.pause();
      fillPercent.value = withSpring(0, SPRING_CONFIG);
    }
  }, [isRecording]);

  useEffect(() => {
    if (state.isRecording) {
      const raw = (state.metering ?? -160) + 160; // shift -160~0 → 0~160
      const normalized = Math.min(raw / 160, 1); // clamp to 0~1
      fillPercent.value = withSpring(normalized, SPRING_CONFIG);
    }
  }, [state]);

  const gaugeTotalWidth = (width - insets.left - insets.right) / 3;

  const animatedFill = useAnimatedStyle(() => ({
    width: fillPercent.value * gaugeTotalWidth,
    backgroundColor: "#16a34a",
  }));

  return (
    <View
      style={[
        styles.wrapper,
        { bottom: insets.bottom - (isLandscape ? 10 : 20) },
      ]}
    >
      <View style={[styles.track, { width: gaugeTotalWidth }]}>
        <Animated.View style={[styles.fill, animatedFill]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
});
