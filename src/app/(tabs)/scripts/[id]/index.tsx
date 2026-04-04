import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { useUpdateScript } from "@/hooks/useUpdateScript";
import { UpdateScriptInput } from "@/utils/interfaces";
import { useTheme } from "@react-navigation/native";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { Activity, use, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StackToolbar } from "expo-router/build/layouts/stack-utils";
import ScriptOverlay from "@/components/ScriptOverlay";
import { useMMKVBoolean, useMMKVNumber } from "react-native-mmkv";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  BottomSheet,
  Button,
  Form,
  Group,
  Host,
  HStack,
  Image,
  Section,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  frame,
  padding,
  presentationDetents,
  presentationDragIndicator,
  tint,
} from "@expo/ui/swift-ui/modifiers";

export default function ScriptDetailScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { script } = useGetScriptById(Number(id));
  const { updateScript } = useUpdateScript();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const [isEditable, setIsEditable] = useState(true);
  const [isTestScriptMode, setIsTestScriptMode] = useState(false);
  const [isTestScriptPlaying, setIsTestScriptPlaying] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [MMKVFontSize, setMMKVFontSize] = useMMKVNumber("fontSize");
  const [MMKVLineHeight, setMMKVLineHeight] = useMMKVNumber("lineHeight");
  const [MMKVScriptBackgroundOpacity, setMMKVScriptBackgroundOpacity] =
    useMMKVNumber("scriptBackgroundOpacity");
  const [MMKVScriptIndicatorStyle0, setMMKVScriptIndicatorStyle0] =
    useMMKVBoolean("scriptIndicatorStyle0");
  const [MMKVScriptIndicatorStyle1, setMMKVScriptIndicatorStyle1] =
    useMMKVBoolean("scriptIndicatorStyle1");
  const [MMKVScriptIndicatorStyle2, setMMKVScriptIndicatorStyle2] =
    useMMKVBoolean("scriptIndicatorStyle2");
  const [MMKVScrollSpeed, setMMKVScrollSPeed] = useMMKVNumber("scrollSpeed");
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const totalScrollHeightRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const debounced = useDebouncedCallback(() => {
    saveHandler(true);
  }, 1000);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true),
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (script && script.length > 0) {
      const scriptContent = script[0].content || "";

      setText(scriptContent);
    }
  }, [script]);

  // on and off auto-scrolling
  useEffect(() => {
    const speedPxPerSec = 6 + Number(MMKVScrollSpeed) * 10;
    const intervalMs = 50;
    const step = (speedPxPerSec * intervalMs) / 1000;

    if (isTestScriptPlaying) {
      intervalRef.current = setInterval(() => {
        scrollY.current += step;
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });
      }, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isTestScriptPlaying, MMKVScrollSpeed]);

  const saveHandler = (skipKeyboardDismiss?: boolean) => {
    if (!script || script.length === 0) return;

    const updatedScript: UpdateScriptInput = {
      id: script[0].id,
      title: script[0].title,
      content: text,
    };

    updateScript(updatedScript);

    if (!skipKeyboardDismiss) {
      Keyboard.dismiss();
    }
  };

  const goToCameraViewHandler = () => {
    saveHandler();
    router.push(`/camera_view?id=${id}`);
  };

  const goBackHandler = () => {
    saveHandler();
    router.back();
  };

  const disableEditing = () => {
    setIsEditable(false);
  };

  const enableEditing = () => {
    setIsEditable(true);
  };

  const playTestScriptHandler = () => {
    setIsTestScriptPlaying(true);
  };

  const pauseTestScriptHandler = () => {
    setIsTestScriptPlaying(false);
  };

  const toggleTestScripMode = () => {
    setIsTestScriptPlaying(false);
    setIsTestScriptMode((prev) => !prev);
  };

  const availableWidth = width - insets.left - insets.right;
  const fontSize = 10 + (MMKVFontSize || 2) * 4;
  const lineHeight = Math.round(fontSize * (MMKVLineHeight || 0.5));

  return (
    <>
      <Activity mode={isTestScriptMode ? "hidden" : "visible"}>
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon={"chevron.left"}
            variant="plain"
            onPress={goBackHandler}
          />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            variant="prominent"
            tintColor={"red"}
            onPress={goToCameraViewHandler}
          >
            • Rec
          </Stack.Toolbar.Button>
          <Stack.Toolbar.Button variant="plain" onPress={saveHandler}>
            Save
          </Stack.Toolbar.Button>
        </Stack.Toolbar>
      </Activity>
      <StackToolbar placement={"bottom"}>
        <Stack.Toolbar.Button
          variant="plain"
          onPress={toggleTestScripMode}
          icon={"pip.swap"}
        />
        <Stack.Toolbar.Spacer />
        <Activity mode={isTestScriptMode ? "visible" : "hidden"}>
          <Activity mode={isTestScriptPlaying ? "hidden" : "visible"}>
            <Stack.Toolbar.Button
              variant="plain"
              onPress={playTestScriptHandler}
              icon={"play.fill"}
            />
          </Activity>
          <Activity mode={isTestScriptPlaying ? "visible" : "hidden"}>
            <Stack.Toolbar.Button
              variant="plain"
              onPress={pauseTestScriptHandler}
              icon={"pause.fill"}
            />
          </Activity>
        </Activity>
        <Stack.Toolbar.Spacer />
        <Activity mode={isTestScriptMode ? "visible" : "hidden"}>
          <Stack.Toolbar.Button
            variant="plain"
            onPress={() => {
              setIsBottomSheetVisible(true);
            }}
            icon={"gear"}
          />
        </Activity>
      </StackToolbar>
      {isTestScriptMode && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
          style={StyleSheet.absoluteFill}
        >
          <ScriptOverlay
            script={text}
            fontSize={fontSize}
            lineHeight={lineHeight}
            backgroundOpacity={MMKVScriptBackgroundOpacity || 0.3}
            scrollRef={scrollRef}
            scrollY={scrollY}
            totalScrollHeightRef={totalScrollHeightRef}
          />
        </Animated.View>
      )}
      {!isTestScriptMode && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{ flex: 1 }}
        >
          <KeyboardAvoidingView
            style={[
              styles.container,
              {
                backgroundColor: theme.colors.card,
              },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView>
              <TextInput
                style={[
                  styles.editor,
                  {
                    color: theme.colors.text,
                    width: availableWidth,
                    paddingTop: 100,
                    paddingBottom: 250,
                  },
                ]}
                scrollEnabled={false}
                onTouchMove={disableEditing}
                onTouchEnd={enableEditing}
                onTouchCancel={enableEditing}
                editable={isEditable}
                multiline={true}
                placeholder="Start typing here..."
                value={text}
                onChangeText={(value) => {
                  setText(value);
                  debounced();
                }}
                textAlignVertical="top"
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
      <Host>
        <BottomSheet
          isPresented={isBottomSheetVisible}
          onIsPresentedChange={setIsBottomSheetVisible}
          modifiers={[tint("black")]}
        >
          <Group
            modifiers={[
              presentationDragIndicator("visible"),
              presentationDetents(["medium"]),
            ]}
          >
            <Form>
              <Section title={"Script"}>
                <Section title={""}>
                  <VStack alignment={"leading"}>
                    <SwiftText>Font Size</SwiftText>
                    <Spacer />
                    <Spacer />
                    <Slider
                      value={MMKVFontSize}
                      min={1}
                      max={10}
                      step={0.5}
                      label={<SwiftText>Size</SwiftText>}
                      minimumValueLabel={<SwiftText>1</SwiftText>}
                      maximumValueLabel={<SwiftText>10</SwiftText>}
                      onValueChange={(value) => {
                        setMMKVFontSize(value);
                      }}
                    />
                  </VStack>
                </Section>
                <Section>
                  <VStack alignment={"leading"}>
                    <SwiftText>Line Height</SwiftText>
                    <Spacer />
                    <Spacer />
                    <Slider
                      value={MMKVLineHeight}
                      min={1}
                      max={10}
                      step={0.5}
                      minimumValueLabel={<SwiftText>1</SwiftText>}
                      maximumValueLabel={<SwiftText>10</SwiftText>}
                      onValueChange={(value) => {
                        setMMKVLineHeight(value);
                      }}
                    />
                  </VStack>
                </Section>
                <Section>
                  <VStack alignment={"leading"}>
                    <SwiftText>Background Opacity</SwiftText>
                    <Spacer />
                    <Spacer />
                    <Slider
                      value={MMKVScriptBackgroundOpacity}
                      min={1}
                      max={10}
                      step={0.5}
                      minimumValueLabel={<SwiftText>1</SwiftText>}
                      maximumValueLabel={<SwiftText>10</SwiftText>}
                      onValueChange={(value) => {
                        setMMKVScriptBackgroundOpacity(value);
                      }}
                    />
                  </VStack>
                </Section>
                <Section>
                  <VStack alignment={"leading"}>
                    <SwiftText>Indicator</SwiftText>
                    <Spacer />
                    <Spacer />
                    <HStack
                      spacing={8}
                      alignment={"center"}
                      modifiers={[frame({ maxWidth: Infinity })]}
                    >
                      <Button
                        onPress={() => {
                          setMMKVScriptIndicatorStyle0((prev) => !prev);
                        }}
                        modifiers={[
                          buttonStyle(
                            MMKVScriptIndicatorStyle0
                              ? "glassProminent"
                              : "glass",
                          ),
                          frame({ maxWidth: 9999 }),
                        ]}
                      >
                        <HStack
                          alignment="center"
                          modifiers={[
                            padding({ vertical: 6, horizontal: 12 }),
                            frame({
                              height: 32,
                              maxWidth: 9999,
                              alignment: "center",
                            }),
                          ]}
                        >
                          <Image systemName={"chevron.right"} size={16} />
                        </HStack>
                      </Button>
                      <Button
                        onPress={() => {
                          setMMKVScriptIndicatorStyle1((prev) => !prev);
                        }}
                        modifiers={[
                          buttonStyle(
                            MMKVScriptIndicatorStyle1
                              ? "glassProminent"
                              : "glass",
                          ),
                          frame({ maxWidth: 9999 }),
                        ]}
                      >
                        <HStack
                          alignment="center"
                          modifiers={[
                            padding({ vertical: 6, horizontal: 12 }),
                            frame({
                              height: 32,
                              maxWidth: 9999,
                              alignment: "center",
                            }),
                          ]}
                        >
                          <Image systemName={"minus"} size={16} />
                        </HStack>
                      </Button>
                      <Button
                        onPress={() => {
                          setMMKVScriptIndicatorStyle2((prev) => !prev);
                        }}
                        modifiers={[
                          buttonStyle(
                            MMKVScriptIndicatorStyle2
                              ? "glassProminent"
                              : "glass",
                          ),
                          frame({ maxWidth: 9999 }),
                        ]}
                      >
                        <HStack
                          alignment="center"
                          modifiers={[
                            padding({ vertical: 6, horizontal: 12 }),
                            frame({
                              height: 32,
                              maxWidth: 9999,
                              alignment: "center",
                            }),
                          ]}
                        >
                          <Image systemName={"chevron.left"} size={16} />
                        </HStack>
                      </Button>
                    </HStack>
                  </VStack>
                </Section>
                <Section title={""}>
                  <VStack alignment={"leading"}>
                    <SwiftText>Scroll Speed</SwiftText>
                    <Spacer />
                    <Spacer />
                    <Slider
                      value={MMKVScrollSpeed}
                      min={5}
                      max={50}
                      step={1}
                      label={<SwiftText>Speed</SwiftText>}
                      minimumValueLabel={<SwiftText>1</SwiftText>}
                      maximumValueLabel={<SwiftText>10</SwiftText>}
                      onValueChange={(value) => {
                        setMMKVScrollSPeed(value);
                      }}
                      modifiers={[]}
                    />
                  </VStack>
                </Section>
              </Section>
            </Form>
          </Group>
        </BottomSheet>
      </Host>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  editor: {
    padding: 20,
    fontSize: 18,
    lineHeight: 24,
    textAlignVertical: "top",
  },
});
