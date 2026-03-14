import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CtaButton from "../components/CtaButton";

export default function OnBoarding3() {
  const router = useRouter();

  function pressHandler() {
    router.replace("/(tabs)");
    //TODO: save data to store that onboarding is completed
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.heroCard}>
        <Image
          source={require("../../assets/images/disk.jpg")}
          style={styles.heroImage}
          contentFit="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Save &amp; Share</Text>
        <Text style={styles.subtitle}>
          Save your videos in high quality{"\n"}and share anywhere with one tap.
        </Text>
      </View>
      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
      </View>
      <CtaButton title="Get Started" pressHandler={pressHandler} />
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
  heroCard: {
    marginTop: 44,
    height: 280,
    borderRadius: 28,
    backgroundColor: "#F7FAFD",
    borderWidth: 1,
    borderColor: "#E2E7EF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#1A1A1A",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    alignItems: "center",
    marginTop: 36,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#1D2B3C",
    fontWeight: "700",
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7686",
    textAlign: "center",
    lineHeight: 24,
  },
  dots: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C9D1DD",
  },
  dotActive: {
    width: 32,
    backgroundColor: "#111111",
  },
});
