import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { useSaveRecording } from "@/hooks/useSaveRecording";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import {
  Button,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CameraViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { script, isScriptLoading, scriptError } = useGetScriptById(Number(id));
  const ref = useRef<any>(null);
  const [mode, setMode] = useState<CameraMode>("video");
  const [facing, setFacing] = useState<CameraType>("back");
  const { isRecording, saveRecording, stopRecording } = useSaveRecording();
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        scrollY.current += 1;
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });
      }, 30); // lower = faster, higher = slower
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRecording]);

  const recordVideo = async () => {
    if (isRecording) {
      stopRecording(ref);
      return;
    }

    // Keep recording aligned to wherever the user last positioned the script.
    scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });

    await saveRecording(ref);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const setupScript = () => {};

  const goToSettings = () => {};

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={"chevron.left"}
          variant="plain"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"camera.rotate"}
          variant="plain"
          onPress={toggleFacing}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Button icon={"note.text"} />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon={isRecording ? "stop.circle.fill" : "play.fill"}
          tintColor={isRecording ? undefined : "red"}
          onPress={recordVideo}
        />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button icon={"gearshape"} />
      </Stack.Toolbar>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={ref}
            mode={mode}
            facing={facing}
            mute={false}
            responsiveOrientationWhenOrientationLocked
          />
        </View>
        {/* Script overlay */}
        {script && (
          <View style={styles.scriptOverlay}>
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scriptScrollContent}
              scrollEventThrottle={16}
              onScroll={handleScriptScroll}
            >
              <Text style={styles.scriptText}>{script[0]?.content}</Text>
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  scriptScrollContent: {
    paddingBottom: 8, // breathing room at the bottom
  },
  scriptOverlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    maxHeight: "40%",
  },
  scriptText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
  },
});
