import RecordingPreview from "@/components/RecordingPreview";
import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { File, Paths } from "expo-file-system";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Activity, use, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScriptOverlay from "@/components/ScriptOverlay";
import PauseButton from "@/components/PauseButton";
import RecordButton from "@/components/RecordButton";
import RecordingTimeBadge from "@/components/RecordingTimeBadge";
import RecordingSaveButton from "@/components/RecordingSaveButton";
import PreferenceButton from "@/components/PreferenceButton";
import { useMMKVNumber, useMMKVString } from "react-native-mmkv";
import { useTheme } from "@react-navigation/native";
import VolumeMeter from "@/components/VolumeMeter";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useMicrophonePermission,
  VideoStabilizationMode,
} from "react-native-vision-camera";

export default function CameraViewScreen() {
  const themes = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { script } = useGetScriptById(Number(id));
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "front",
  );
  const cameraRef = useRef<Camera>(null);
  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | undefined>(
    undefined,
  );
  const [isSavingPreviewVideo, setIsSavingPreviewVideo] =
    useState<boolean>(false);
  const [isVoiceRecognizing, setIsVoiceRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const totalScrollHeightRef = useRef(0);
  const scriptWordIndexRef = useRef(0);
  const recordingTimeRef = useRef<NodeJS.Timeout | null>(null);
  const [currentRecordingTime, setCurrentRecordingTime] = useState(0);
  const [MMKVScrollSpeed] = useMMKVNumber("scrollSpeed");
  const [MMKVFontSize] = useMMKVNumber("fontSize");
  const [MMKVLineHeight] = useMMKVNumber("lineHeight");
  const [MMKVScriptBackgroundOpacity] = useMMKVNumber(
    "scriptBackgroundOpacity",
  );
  const [MMKVResolution, setMMKVResolution] = useMMKVString("resolution");
  const [MMKVFrameRate, setMMKVFrameRate] = useMMKVNumber("frameRate");
  const [MMKVStabilization, setMMKVStabilization] =
    useMMKVString("stabilization");
  const cameraDevice = useCameraDevice(cameraPosition);
  const cameraFormat = useCameraFormat(cameraDevice, [
    { fps: MMKVFrameRate },
    {
      videoResolution:
        MMKVResolution == "4K"
          ? { width: 3840, height: 2160 }
          : { width: 1920, height: 1080 },
    },
    {
      videoStabilizationMode:
        (MMKVStabilization as VideoStabilizationMode) || "auto",
    },
  ]);

  // const [MMKVVoiceRecognition, _setMMKVVoiceRecognition] =
  //   useMMKVBoolean("voiceRecognition");
  // const [MMKVLanguage, _setMMKVLanguage] = useMMKVString("language");

  // useSpeechRecognitionEvent("start", () => {
  //   console.log("voice recognition, start");
  //   setIsVoiceRecognizing(true);
  // });
  // useSpeechRecognitionEvent("end", () => {
  //   console.log("voice recognition end");
  //   setIsVoiceRecognizing(false);
  // });
  // useSpeechRecognitionEvent("result", (event) => {
  //   const text = event.results[0]?.transcript ?? "";
  //   setTranscript(text);
  //
  //   if (MMKVVoiceRecognition && isRecording) {
  //     scrollToTranscriptPosition(text);
  //   }
  // });
  // useSpeechRecognitionEvent("error", (event) => {
  //   console.log("error code:", event.error, "error message:", event.message);
  // });
  // useSpeechRecognitionEvent("volumechange", (event) => {
  //   // a value between -2 and 10. <= 0 is inaudible
  //   // console.log("Volume changed to:", event.value);
  // });

  // hide the tab bar
  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  // ask permissions
  useEffect(() => {
    if (!hasCameraPermission) {
      requestCameraPermission();
    }

    if (!hasMicrophonePermission) {
      requestMicrophonePermission();
    }
  }, [hasCameraPermission, hasMicrophonePermission]);

  // on and off auto-scrolling
  useEffect(() => {
    const speedPxPerSec = 6 + Number(MMKVScrollSpeed) * 10;
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
  }, [isRecording, MMKVScrollSpeed]);

  const recordHandler = async () => {
    scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });

    setIsRecording(true);

    if (!cameraRef.current) {
      return;
    }

    cameraRef.current.startRecording({
      onRecordingFinished: (video) => {
        setCurrentVideoUri(video.path);
        setIsSavingPreviewVideo(false);
      },
      onRecordingError: (error) => {
        console.log(error);
        Alert.alert("Error", "Something went wrong while recording the video");
      },
    });
  };

  const pauseHandler = () => {
    if (!cameraRef.current) {
      return;
    }

    void cameraRef.current.stopRecording();
    setIsSavingPreviewVideo(true);
    setIsRecording(false);
    setCurrentRecordingTime(0);
  };

  const toggleFacing = () => {
    setCameraPosition((prev) => {
      if (prev === "back") {
        return "front";
      }

      if (prev === "front") {
        return "back";
      }

      return "front";
    });
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
          setIsSavingPreviewVideo(false);
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

  const fontSize = 10 + (MMKVFontSize || 2) * 4;
  const lineHeight = Math.round(fontSize * (MMKVLineHeight || 0.5));
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const isLandscape = width > height;
  const rightHalfLeft = insets.left + availableWidth / 2;
  const playPausePositionStyle = isLandscape
    ? { left: rightHalfLeft, right: insets.right }
    : { left: 0, right: 0 };

  if (!hasCameraPermission || !hasMicrophonePermission) {
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
        <View style={StyleSheet.absoluteFill}>
          <Camera
            ref={cameraRef}
            format={cameraFormat}
            device={cameraDevice!}
            style={StyleSheet.absoluteFill}
            fps={cameraFormat?.maxFps}
            isActive={true}
            video={true}
            audio={true}
            enableLocation={false}
          />
        </View>
        <ScriptOverlay
          script={script?.[0].content || ""}
          fontSize={fontSize}
          lineHeight={lineHeight}
          backgroundOpacity={MMKVScriptBackgroundOpacity || 0.3}
          scrollRef={scrollRef}
          scrollY={scrollY}
          totalScrollHeightRef={totalScrollHeightRef}
        />
        {currentVideoUri && <RecordingPreview tempVideoUri={currentVideoUri} />}
      </View>
      <VolumeMeter isRecording={isRecording} />
      <View
        style={[
          styles.playPauseWrapper,
          playPausePositionStyle,
          { bottom: insets.bottom },
        ]}
      >
        <Activity
          mode={isSavingPreviewVideo || currentVideoUri ? "hidden" : "visible"}
        >
          <Activity mode={!isRecording ? "visible" : "hidden"}>
            <RecordButton pressHandler={recordHandler} />
          </Activity>
          <Activity mode={isRecording ? "visible" : "hidden"}>
            <PauseButton pressHandler={pauseHandler} />
          </Activity>
        </Activity>
        <Activity mode={isSavingPreviewVideo ? "visible" : "hidden"}>
          <ActivityIndicator size={"large"} color={themes.colors.text} />
        </Activity>
      </View>
      <Activity mode={isRecording ? "visible" : "hidden"}>
        <RecordingTimeBadge currentRecordingTime={currentRecordingTime} />
      </Activity>
      <Activity mode={!isRecording && currentVideoUri ? "visible" : "hidden"}>
        <RecordingSaveButton saveHandler={saveHandler} />
      </Activity>
      <Activity
        mode={
          !isRecording && !currentVideoUri && !isSavingPreviewVideo
            ? "visible"
            : "hidden"
        }
      >
        <PreferenceButton />
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
  playPauseWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
    elevation: 10,
  },
});
