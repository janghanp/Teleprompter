import CtaButton from "@/components/CtaButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnBoarding1() {
  const router = useRouter();

  function pressHandler() {
    router.replace("/OnBoarding2");
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.heroCard}>
        <Image
          source={require("@/assets/images/camera.png")}
          style={styles.heroImage}
          contentFit="cover"
        />
      </View>
      <View>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to{"\n"}Teleprompter</Text>
          <Text style={styles.subtitle}>
            Your professional recording{"\n"}companion. Create, record, and
            share
            {"\n"}with ease.
          </Text>
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
      <CtaButton title="Continue" pressHandler={pressHandler} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F3F5",
    paddingHorizontal: 24,
    paddingTop: 12,
    justifyContent: "space-between",
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
  cameraButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A1A1A",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  cameraBody: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#111111",
  },
  cameraLens: {
    position: "absolute",
    right: 28,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#111111",
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
