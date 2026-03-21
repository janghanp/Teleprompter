import TempVideo from "@/components/TempVideo";
import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { formatTime } from "@/utils";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { File, Paths } from "expo-file-system";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Activity, use, useEffect, useRef, useState } from "react";
import {
  Alert,
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
  const { script } = useGetScriptById(Number(id));
  const cameraRef = useRef<CameraView>(null);
  const [mode] = useState<CameraMode>("video");
  const [facing, setFacing] = useState<CameraType>("front");
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | undefined>(
    undefined,
  );
  const recordingTimeRef = useRef<NodeJS.Timeout | null>(null);
  const [currentRecordingTime, setCurrentRecordingTime] = useState(0);

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

      recordingTimeRef.current = setInterval(() => {
        setCurrentRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (recordingTimeRef.current) {
        clearInterval(recordingTimeRef.current);
      }
    }
  }, [isRecording]);

  const toggleRecordVideo = async () => {
    // stop the ongoing recording
    if (isRecording) {
      setIsRecording(false);
      cameraRef?.current?.stopRecording();
      setCurrentRecordingTime(0);
      return;
    }

    scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });

    setIsRecording(true);
    const video = await cameraRef?.current?.recordAsync();

    if (video?.uri) {
      setCurrentVideoUri(video.uri);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const cancelHandler = () => {
    Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setIsRecording(false);
          setCurrentVideoUri(undefined);
        },
      },
    ]);
  };

  const saveHandler = () => {
    if (!currentVideoUri) {
      return;
    }

    const tempFile = new File(currentVideoUri);
    const savedFile = new File(
      Paths.document,
      `teleprompter_${Date.now()}.mp4`,
    );

    tempFile.move(savedFile);
    router.replace("/(tabs)/recordings");
  };

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

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
          hidden={isRecording || !!currentVideoUri}
        />
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"camera.rotate"}
          variant="plain"
          onPress={toggleFacing}
          hidden={isRecording || !!currentVideoUri}
        />
        <Stack.Toolbar.Button
          variant="plain"
          onPress={cancelHandler}
          hidden={isRecording || !currentVideoUri}
        >
          Cancel
        </Stack.Toolbar.Button>
      </Stack.Toolbar>

      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon={isRecording ? "stop.circle.fill" : "play.fill"}
          tintColor={isRecording ? "red" : "black"}
          onPress={toggleRecordVideo}
        />
        <Stack.Toolbar.Spacer />
        <Activity mode={!isRecording && currentVideoUri ? "visible" : "hidden"}>
          <Stack.Toolbar.Button onPress={saveHandler}>
            Done
          </Stack.Toolbar.Button>
        </Activity>
        <Activity mode={isRecording ? "visible" : "hidden"}>
          <Stack.Toolbar.Button>
            {formatTime(currentRecordingTime)}
          </Stack.Toolbar.Button>
        </Activity>
      </Stack.Toolbar>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
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
        {currentVideoUri && (
          <View style={styles.tempVideoWrapper}>
            <TempVideo tempVideoUri={currentVideoUri!} />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
  tempVideoWrapper: {
    position: "absolute",
    left: 16,
    bottom: 16,
    zIndex: 5,
  },
});
