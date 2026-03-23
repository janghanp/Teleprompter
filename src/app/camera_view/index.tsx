import RecordingPreview from "@/components/RecordingPreview";
import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
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
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { asyncStorage } from "..";
import ScriptOverlay from "@/components/ScriptOverlay";
import PauseButton from "@/components/PauseButton";
import RecordButton from "@/components/RecordButton";
import RecordingTimeBadge from "@/components/RecordingTimeBadge";
import RecordingSaveButton from "@/components/RecordingSaveButton";

export default function CameraViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
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
  const [fontSizeInitialValue, setFontSizeInitialValue] = useState(0);
  const [scrollSpeedInitialValue, setScrollSpeedInitialValue] = useState(2);
  const [lineHeightValue, setLineHeightValue] = useState(1.4);

  // hide the tab bar
  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  // load preference values
  useEffect(() => {
    (async () => {
      const fontSizeValueFromAsync = await asyncStorage.getItem("fontSize");
      setFontSizeInitialValue(Number(fontSizeValueFromAsync) || 0);
    })();

    (async () => {
      const scrollSpeedValueFromAsync =
        await asyncStorage.getItem("scrollSpeed");
      setScrollSpeedInitialValue(Number(scrollSpeedValueFromAsync) || 0);
    })();

    (async () => {
      const lineHeightValueFromAsync = await asyncStorage.getItem("lineHeight");
      const parsed = Number(lineHeightValueFromAsync);
      setLineHeightValue(Number.isFinite(parsed) && parsed > 0 ? parsed : 1.4);
    })();
  }, []);

  // ask permission to use camera
  useEffect(() => {
    if (!permission || !permission.granted) {
      void requestPermission();
    }
  }, [permission]);

  // on and off auto-scrolling
  useEffect(() => {
    const speedPxPerSec = 6 + Number(scrollSpeedInitialValue) * 5;
    const intervalMs = 50;
    const step = (speedPxPerSec * intervalMs) / 1000;

    if (isRecording) {
      intervalRef.current = setInterval(() => {
        scrollY.current += step;
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });
      }, intervalMs);

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
  }, [isRecording, scrollSpeedInitialValue]);

  const recordHandler = async () => {
    scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });

    setIsRecording(true);
    const video = await cameraRef?.current?.recordAsync();

    if (video?.uri) {
      setCurrentVideoUri(video.uri);
    }
  };

  const pauseHandler = () => {
    setIsRecording(false);
    cameraRef?.current?.stopRecording();
    setCurrentRecordingTime(0);
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

  const saveHandler = async () => {
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

  const fontSize = 10 + Number(fontSizeInitialValue) * 4;
  const lineHeight = Math.round(fontSize * lineHeightValue);
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const isLandscape = width > height;
  const rightHalfLeft = insets.left + availableWidth / 2;
  const playPausePositionStyle = isLandscape
    ? { left: rightHalfLeft, right: insets.right }
    : { left: 0, right: 0 };

  // Camera permissions are still loading.
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return <View />;
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

      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            mode={mode}
            facing={facing}
            mute={false}
            mirror={facing === "front"}
            focusable
            responsiveOrientationWhenOrientationLocked
          />
        </View>

        <ScriptOverlay
          script={script?.[0].content || ""}
          fontSize={fontSize}
          lineHeight={lineHeight}
        />

        {currentVideoUri && <RecordingPreview tempVideoUri={currentVideoUri} />}
      </View>

      {/* record and pause buttons*/}
      <View style={[styles.playPauseWrapper, playPausePositionStyle]}>
        <Activity mode={!isRecording ? "visible" : "hidden"}>
          <RecordButton pressHandler={recordHandler} />
        </Activity>

        <Activity mode={isRecording ? "visible" : "hidden"}>
          <PauseButton pressHandler={pauseHandler} />
        </Activity>
      </View>

      {/* Recording time */}
      <Activity mode={isRecording ? "visible" : "hidden"}>
        <RecordingTimeBadge currentRecordingTime={currentRecordingTime} />
      </Activity>

      {/* Save button*/}
      <Activity mode={!isRecording && currentVideoUri ? "visible" : "hidden"}>
        <RecordingSaveButton saveHandler={saveHandler} />
      </Activity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  playPauseWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
});
