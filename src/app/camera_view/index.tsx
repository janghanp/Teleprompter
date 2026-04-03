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
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from "react-native-mmkv";
import {
  useSpeechRecognitionEvent,
  ExpoSpeechRecognitionModule,
} from "expo-speech-recognition";
import { useTheme } from "@react-navigation/native";
import VolumeMeter from "@/components/VolumeMeter";

export default function CameraViewScreen() {
  const themes = useTheme();
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
  const [MMKVScrollSpeed] = useMMKVNumber("scrollSpeed");
  const [MMKVFontSize] = useMMKVNumber("fontSize");
  const [MMKVLineHeight] = useMMKVNumber("lineHeight");
  const [MMKVScriptBackgroundOpacity] = useMMKVNumber(
    "scriptBackgroundOpacity",
  );
  const [MMKVVoiceRecognition, _setMMKVVoiceRecognition] =
    useMMKVBoolean("voiceRecognition");
  const [MMKVLanguage, _setMMKVLanguage] = useMMKVString("language");
  const [isSavingPreviewVideo, setIsSavingPreviewVideo] =
    useState<boolean>(false);
  const [isVoiceRecognizing, setIsVoiceRecognizing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const totalScrollHeightRef = useRef(0);
  const scriptWordIndexRef = useRef(0);

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

  // ask permission to use camera
  useEffect(() => {
    if (!permission || !permission.granted) {
      void requestPermission();
    }
  }, [permission]);

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
  }, [isRecording, MMKVScrollSpeed, MMKVVoiceRecognition]);

  //TODO: make sure the current position is always in the middle of the script overley height

  // const scrollToTranscriptPosition = (transcriptText: string) => {
  //   if (!script?.[0]?.content || totalScrollHeightRef.current === 0) return;
  //
  //   const normalize = (s: string) =>
  //     s
  //       .toLowerCase()
  //       .replace(/[^a-z0-9\s]/g, "")
  //       .trim();
  //
  //   const scriptWords = normalize(script[0].content).split(/\s+/);
  //   const spokenWords = normalize(transcriptText).split(/\s+/);
  //
  //   // Use the last few spoken words as a search window
  //   const window = spokenWords.slice(-6);
  //   const searchFrom = Math.max(0, scriptWordIndexRef.current - 3);
  //
  //   for (let i = searchFrom; i <= scriptWords.length - window.length; i++) {
  //     const isMatch = window.every((w, j) => scriptWords[i + j]?.startsWith(w));
  //     if (isMatch) {
  //       scriptWordIndexRef.current = i + window.length;
  //       const progress = scriptWordIndexRef.current / scriptWords.length;
  //       const targetY = progress * totalScrollHeightRef.current;
  //       scrollY.current = targetY;
  //       scrollRef.current?.scrollTo({ y: targetY, animated: true });
  //       break;
  //     }
  //   }
  // };

  // const handleVoiceRecognitionStart = async () => {
  //   const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  //
  //   if (!result.granted) {
  //     console.warn("Permissions not granted", result);
  //     return;
  //   }
  //
  //   // Start speech recognition
  //   ExpoSpeechRecognitionModule.start({
  //     lang: MMKVLanguage || "en-AU",
  //     interimResults: true,
  //     continuous: true,
  //     volumeChangeEventOptions: {
  //       enabled: true,
  //       intervalMillis: 300,
  //     },
  //   });
  // };

  const recordHandler = async () => {
    scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });

    setIsRecording(true);
    const video = await cameraRef?.current?.recordAsync();

    if (video?.uri) {
      setCurrentVideoUri(video.uri);
      setIsSavingPreviewVideo(false);
    }
  };

  const pauseHandler = () => {
    // if (MMKVVoiceRecognition && isVoiceRecognizing) {
    //   ExpoSpeechRecognitionModule.stop();
    // }

    cameraRef?.current?.stopRecording();
    setIsSavingPreviewVideo(true);
    setIsRecording(false);
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
            videoStabilizationMode={"cinematic"}
            videoQuality={"2160p"}
            focusable
            responsiveOrientationWhenOrientationLocked
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
  cameraContainer: StyleSheet.absoluteFillObject,
  camera: StyleSheet.absoluteFillObject,
  playPauseWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
    elevation: 10,
  },
});
