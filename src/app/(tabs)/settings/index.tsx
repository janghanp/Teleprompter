import { ScrollView, StyleSheet, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <>
      <ScrollView
        style={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  content: {
    marginTop: 24,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D2B3C",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7686",
    lineHeight: 22,
  },
});
