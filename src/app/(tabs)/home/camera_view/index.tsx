import { TabBarContext } from "@/context/TabBarContext";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function CameraViewScreen() {
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<any>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("video");
  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const recordVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      ref.current?.stopRecording();
      return;
    }

    setIsRecording(true);
    const video = await ref.current?.recordAsync();
    console.log({ video });
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
});
