import { TabBarContext } from "@/context/TabBarContext";
import { File, Paths } from "expo-file-system";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { use } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordingPlayerScreen() {
  const router = useRouter();
  const { setIsTabBarHidden } = use(TabBarContext);
  const { name: rawName } = useLocalSearchParams<{ name?: string }>();
  const name = typeof rawName === "string" ? rawName : "";
  const decodedName = name ? decodeURIComponent(name) : "";
  const file = decodedName ? new File(Paths.document, decodedName) : null;
  const sourceUri = file && file.exists ? file.uri : null;
  const player = useVideoPlayer(sourceUri, (instance) => {});

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  if (!decodedName) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Missing recording name.</Text>
      </SafeAreaView>
    );
  }

  if (file && !file.exists) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Recording not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={"chevron.left"}
          variant="plain"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <SafeAreaView style={styles.safeArea}>
        <VideoView
          style={styles.video}
          player={player}
          allowsPictureInPicture={false}
          contentFit="contain"
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#b00020",
    fontSize: 16,
  },
});
