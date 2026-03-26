import { asyncStorage } from "@/app";
import { TabBarContext } from "@/context/TabBarContext";
import {
  Button,
  Form,
  Group,
  Host,
  HStack,
  Section,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
  Image,
} from "@expo/ui/swift-ui";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { use, useEffect, useState } from "react";
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
  shapes,
} from "@expo/ui/swift-ui/modifiers";
import ScriptIndicator from "@/components/ScriptIndicator";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SettingsScriptScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { setIsTabBarHidden } = use(TabBarContext);

  const [fontSizeValue, setFontSizeValue] = useState(2);
  const [lineHeightValue, setLineHeightValue] = useState(1.4);
  const [backgroundOpacityValue, setBackgroundOpacityValue] = useState(0.2);
  const [indicatorValue0, setIndicatorValue0] = useState(false);
  const [indicatorValue1, setIndicatorValue1] = useState(false);
  const [indicatorValue2, setIndicatorValue2] = useState(false);

  // hide tab bar
  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  useEffect(() => {
    // font size
    (async () => {
      const fontSizeValueFromAsync = await asyncStorage.getItem("fontSize");
      const parsed = Number(fontSizeValueFromAsync);
      setFontSizeValue(Number.isFinite(parsed) && parsed > 0 ? parsed : 2);
    })();

    // line height
    (async () => {
      const lineHeightValueFromAsync = await asyncStorage.getItem("lineHeight");
      const parsed = Number(lineHeightValueFromAsync);
      setLineHeightValue(Number.isFinite(parsed) && parsed > 0 ? parsed : 1.4);
    })();

    // background opacity
    (async () => {
      const opacityFromAsync = await asyncStorage.getItem(
        "scriptBackgroundOpacity",
      );

      const parsed = Number(opacityFromAsync);

      setBackgroundOpacityValue(parsed);
    })();

    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle0",
      );

      setIndicatorValue0(!!indicatorValueFromAsync);
    })();

    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle1",
      );

      setIndicatorValue1(!!indicatorValueFromAsync);
    })();

    (async () => {
      const indicatorValueFromAsync = await asyncStorage.getItem(
        "scriptIndicatorStyle2",
      );

      setIndicatorValue2(!!indicatorValueFromAsync);
    })();
  }, []);

  const fontSize = 10 + fontSizeValue * 4;
  const lineHeight = Math.round(fontSize * lineHeightValue);
  const overlayBackgroundColor = `rgba(0, 0, 0, ${backgroundOpacityValue * 0.1})`;
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
    <SafeAreaView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </Text>
        </ScrollView>
        <GestureHandlerRootView>
          <View style={{ position: "absolute", left: -16, right: -16 }}>
            <ScriptIndicator
              currentScriptOverlayHeight={200}
              leftArrow={indicatorValue0}
              line={indicatorValue1}
              rightArrow={indicatorValue2}
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
                  value={fontSizeValue}
                  min={1}
                  max={10}
                  step={0.5}
                  label={<SwiftText>Size</SwiftText>}
                  minimumValueLabel={<SwiftText>1</SwiftText>}
                  maximumValueLabel={<SwiftText>10</SwiftText>}
                  onValueChange={(value) => {
                    setFontSizeValue(value);
                    asyncStorage.setItem("fontSize", value.toString());
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
                  value={lineHeightValue}
                  min={1}
                  max={10}
                  step={0.5}
                  minimumValueLabel={<SwiftText>1</SwiftText>}
                  maximumValueLabel={<SwiftText>10</SwiftText>}
                  onValueChange={(value) => {
                    setLineHeightValue(value);
                    asyncStorage.setItem("lineHeight", value.toString());
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
                  value={backgroundOpacityValue}
                  min={1}
                  max={10}
                  step={0.5}
                  minimumValueLabel={<SwiftText>1</SwiftText>}
                  maximumValueLabel={<SwiftText>10</SwiftText>}
                  onValueChange={(value) => {
                    setBackgroundOpacityValue(value);
                    asyncStorage.setItem(
                      "scriptBackgroundOpacity",
                      value.toString(),
                    );
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
                      setIndicatorValue0((prev) => !prev);

                      if (indicatorValue0) {
                        asyncStorage.removeItem("scriptIndicatorStyle0");
                      } else {
                        asyncStorage.setItem("scriptIndicatorStyle0", "true");
                      }
                    }}
                    modifiers={[
                      buttonStyle(indicatorValue0 ? "glassProminent" : "glass"),
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
                      setIndicatorValue1((prev) => !prev);

                      if (indicatorValue1) {
                        asyncStorage.removeItem("scriptIndicatorStyle1");
                      } else {
                        asyncStorage.setItem("scriptIndicatorStyle1", "true");
                      }
                    }}
                    modifiers={[
                      buttonStyle(indicatorValue1 ? "glassProminent" : "glass"),
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
                      setIndicatorValue2((prev) => !prev);

                      if (indicatorValue2) {
                        asyncStorage.removeItem("scriptIndicatorStyle2");
                      } else {
                        asyncStorage.setItem("scriptIndicatorStyle2", "true");
                      }
                    }}
                    modifiers={[
                      buttonStyle(indicatorValue2 ? "glassProminent" : "glass"),
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
