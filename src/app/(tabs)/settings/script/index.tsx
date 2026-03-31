import { TabBarContext } from "@/context/TabBarContext";
import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
} from "@expo/ui/swift-ui";
import { useFocusEffect } from "expo-router";
import { use } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  background,
  buttonStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import ScriptIndicator from "@/components/ScriptIndicator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMMKVBoolean, useMMKVNumber } from "react-native-mmkv";

export default function SettingsScriptScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { setIsTabBarHidden } = use(TabBarContext);

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

  // hide tab bar
  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const fontSize = 10 + (MMKVFontSize || 2) * 4;
  const lineHeight = Math.round(fontSize * (MMKVLineHeight || 0.5));
  const overlayBackgroundColor = `rgba(0, 0, 0, ${(MMKVScriptBackgroundOpacity || 0.3) * 0.1})`;
  const availableWidth = Math.max(0, width - insets.left - insets.right);
  const isLandscape = width > height;
  const columnGap = 16;
  const halfWidth = isLandscape
    ? Math.max(0, (availableWidth - columnGap) / 2)
    : availableWidth;
  const overlayPositionStyle = isLandscape
    ? { left: insets.left, width: halfWidth }
    : { left: 0, right: 0 };
  const sliderPositionStyle = isLandscape
    ? { left: insets.left + halfWidth + columnGap, right: insets.right }
    : { left: 0, right: 0 };

  return (
    <SafeAreaView style={[styles.screen]}>
      <View
        style={[
          styles.scriptOverlay,
          overlayPositionStyle,
          {
            maxHeight: isLandscape ? "100%" : "45%",
            top: isLandscape ? 10 : 20,
            backgroundColor: overlayBackgroundColor,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scriptScrollContent}
          scrollEventThrottle={16}
        >
          <Text style={[styles.scriptText, { fontSize, lineHeight }]}>
            Hello everyone, and thanks for joining me today. I want to share a
            quick idea about clear communication and why preparation matters.
            Whether you’re recording a video, presenting to a team, or speaking
            at an event, the most important thing is connecting with your
            audience. A short plan helps. Start with a simple message, use
            examples people recognize, and keep your pace steady. If you pause
            at key moments, people have time to absorb what you’re saying.
            Today’s message is simple: clarity builds trust. When your ideas are
            easy to follow, people listen. When you sound confident, people
            believe you. So the next time you press record or step in front of a
            group, take a minute to prepare. Know your opening, know your
            closing, and let the middle flow naturally. Thanks for your time.
            Let’s keep making communication easier, one message at a time. Hello
            everyone, and thanks for joining me today. I want to share a quick
            idea about clear communication and why preparation matters. Whether
            you’re recording a video, presenting to a team, or speaking at an
            event, the most important thing is connecting with your audience. A
            short plan helps. Start with a simple message, use examples people
            recognize, and keep your pace steady. If you pause at key moments,
            people have time to absorb what you’re saying. Today’s message is
            simple: clarity builds trust. When your ideas are easy to follow,
            people listen. When you sound confident, people believe you. So the
            next time you press record or step in front of a group, take a
            minute to prepare. Know your opening, know your closing, and let the
            middle flow naturally. Thanks for your time. Let’s keep making
            communication easier, one message at a time.
          </Text>
        </ScrollView>
        <GestureHandlerRootView>
          <View style={{ position: "absolute", left: -16, right: -16 }}>
            <ScriptIndicator
              currentScriptOverlayHeight={200}
              leftArrow={MMKVScriptIndicatorStyle0 ?? false}
              line={MMKVScriptIndicatorStyle1 ?? false}
              rightArrow={MMKVScriptIndicatorStyle2 ?? false}
            />
          </View>
        </GestureHandlerRootView>
      </View>
      <View
        style={[
          styles.sliderContainer,
          isLandscape
            ? styles.sliderContainerLandscape
            : styles.sliderContainerPortrait,
          sliderPositionStyle,
        ]}
      >
        <Host style={{ flex: 1 }}>
          <Form>
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
            <Section modifiers={[background("clear")]}>
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
                        MMKVScriptIndicatorStyle0 ? "glassProminent" : "glass",
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
                        MMKVScriptIndicatorStyle1 ? "glassProminent" : "glass",
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
                        MMKVScriptIndicatorStyle2 ? "glassProminent" : "glass",
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
          </Form>
        </Host>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  scriptScrollContent: {
    paddingBottom: 8,
  },
  scriptOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
  },
  scriptText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
  },
  sliderHost: {
    position: "absolute",
    height: 60,
    bottom: 60,
  },
  sliderContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flex: 1,
  },
  sliderContainerPortrait: {
    top: "50%",
    bottom: 0,
  },
  sliderContainerLandscape: {
    top: 10,
    bottom: 10,
  },
});
