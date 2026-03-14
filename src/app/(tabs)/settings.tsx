import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Basic settings screen inside the tabs layout.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F3F5",
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
