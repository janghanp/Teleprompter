import { Text, View, StyleSheet } from "react-native";
import { formatTime } from "@/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  currentRecordingTime: number;
}

export default function RecordingTimeBadge({ currentRecordingTime }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.recordingTimeBadge, { bottom: insets.bottom }]}>
      <Text style={styles.recordingTimeText}>
        {formatTime(currentRecordingTime)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  recordingTimeBadge: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    zIndex: 10,
    elevation: 10,
  },
  recordingTimeText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
