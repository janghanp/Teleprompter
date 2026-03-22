import TempVideo from "@/components/TempVideo";
import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { formatTime } from "@/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
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
import { use, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { asyncStorage } from "..";

export default function CameraViewScreen() {
  const theme = useTheme();
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
  const overlayHeight = useSharedValue(300);
  const startHeight = useSharedValue(300);
  const overlayStyle = useAnimatedStyle(() => ({
    height: overlayHeight.value,
  }));
  const handleTranslateY = useSharedValue(0);
  const handleStartY = useSharedValue(0);
  const [fontSizeInitialValue, setFontSizeInitialValue] = useState(0);
  const [scrollSpeedInitialValue, setScrollSpeedInitialValue] = useState(2);
  const [lineHeightValue, setLineHeightValue] = useState(1.4);

  const handleHeight = 8;
  const handleBaseBottom = 50;

  const pan = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = overlayHeight.value;
    })
    .onUpdate((e) => {
      overlayHeight.value = Math.max(
        100,
        Math.min(startHeight.value + e.translationY, 800),
      );
    });

  const handlePan = Gesture.Pan()
    .onBegin(() => {
      handleStartY.value = handleTranslateY.value;
    })
    .onUpdate((e) => {
      const minTranslate = -(
        overlayHeight.value -
        handleBaseBottom -
        handleHeight
      );
      const maxTranslate = handleBaseBottom;
      const nextValue = handleStartY.value + e.translationY;
      handleTranslateY.value = Math.min(
        maxTranslate,
        Math.max(minTranslate, nextValue),
      );
    });

  const handleStyle = useAnimatedStyle(() => {
    const minTranslate = -(
      overlayHeight.value -
      handleBaseBottom -
      handleHeight
    );
    const maxTranslate = handleBaseBottom;
    const clampedTranslate = Math.min(
      maxTranslate,
      Math.max(minTranslate, handleTranslateY.value),
    );

    return {
      transform: [{ translateY: clampedTranslate }],
    };
  });

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

  const fontSize = 10 + Number(fontSizeInitialValue) * 4;
  const lineHeight = Math.round(fontSize * lineHeightValue);
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const isLandscape = width > height;
  const overlayWidth = isLandscape ? availableWidth / 2 : availableWidth;
  const overlayPositionStyle = isLandscape
    ? { left: insets.left, width: overlayWidth }
    : { left: 0, right: 0 };
  const rightHalfLeft = insets.left + availableWidth / 2;
  const playPausePositionStyle = isLandscape
    ? { left: rightHalfLeft, right: insets.right }
    : { left: 0, right: 0 };
  const tempVideoPositionStyle = isLandscape
    ? { left: rightHalfLeft + 16 }
    : { left: 16 };

  return (
    <GestureHandlerRootView>
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
            mirror={facing === "front" ? true : false}
            responsiveOrientationWhenOrientationLocked
          />
        </View>

        {/* Script overlay */}
        {script && (
          <>
            <Animated.View
              style={[
                styles.scriptOverlay,
                overlayStyle,
                {
                  ...overlayPositionStyle,
                  top: isLandscape ? 10 : 30,
                  height: "auto",
                  maxHeight: isLandscape ? "95%" : "70%",
                },
              ]}
            >
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.scriptScrollContent}
                scrollEventThrottle={16}
                onScroll={handleScriptScroll}
              >
                <Text style={[styles.scriptText, { fontSize, lineHeight }]}>
                  {script[0]?.content}
                </Text>
              </ScrollView>

              <GestureDetector gesture={pan}>
                <View
                  style={{
                    right: 4,
                    bottom: 4,
                    position: "absolute",
                    width: 40,
                    height: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                    borderRadius: 10,
                  }}
                >
                  <Pressable>
                    <Ionicons name="resize" size={35} color={"white"} />
                  </Pressable>
                </View>
              </GestureDetector>
              <GestureDetector gesture={handlePan}>
                <Animated.View
                  style={[
                    {
                      left: 0,
                      right: 0,
                      bottom: handleBaseBottom,
                      position: "absolute",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: handleHeight,
                      backgroundColor: "rgba(250, 128, 114, 0.45)",
                      borderRadius: 10,
                    },
                    handleStyle,
                  ]}
                />
              </GestureDetector>
            </Animated.View>
          </>
        )}

        {currentVideoUri && (
          <View style={[styles.tempVideoWrapper, tempVideoPositionStyle]}>
            <TempVideo tempVideoUri={currentVideoUri!} />
          </View>
        )}
      </View>

      <View
        style={[styles.playPauseWrapper, playPausePositionStyle]}
        pointerEvents="box-none"
      >
        <Pressable
          style={[
            styles.playPauseButton,
            isRecording ? styles.pauseButton : styles.playButton,
          ]}
          onPress={toggleRecordVideo}
        >
          {isRecording && (
            <Ionicons name={"square"} size={30} color="#e60000" />
          )}
          {!isRecording && (
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#e60000",
                borderRadius: 100,
              }}
            ></View>
          )}
        </Pressable>
      </View>

      {isRecording ? (
        <View style={styles.recordingTimeBadge}>
          <Text style={styles.recordingTimeText}>
            {formatTime(currentRecordingTime)}
          </Text>
        </View>
      ) : currentVideoUri ? (
        <Pressable
          style={[styles.saveButton, { backgroundColor: theme.colors.card }]}
          onPress={saveHandler}
        >
          <Text style={[styles.saveButtonText, { color: theme.colors.text }]}>
            Save
          </Text>
        </Pressable>
      ) : null}
    </GestureHandlerRootView>
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
    top: 30,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    height: 300,
    maxHeight: "50%",
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
  playPauseWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  pauseButton: {
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  recordingTimeBadge: {
    position: "absolute",
    right: 16,
    bottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    zIndex: 10,
    elevation: 10,
  },
  recordingTimeText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  saveButton: {
    position: "absolute",
    right: 16,
    bottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    zIndex: 10,
    elevation: 10,
  },
  saveButtonText: {
    fontSize: 20,
  },
});
