import { asyncStorage } from "@/app";
import { TabBarContext } from "@/context/TabBarContext";
import {
  Host,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
} from "@expo/ui/swift-ui";
import { useTheme } from "@react-navigation/native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
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

export default function LineHeightScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setIsTabBarHidden } = use(TabBarContext);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [fontSizeInitialValue, setFontSizeInitialValue] = useState(2);
  const [lineHeightValue, setLineHeightValue] = useState(1.4);

  useEffect(() => {
    (async () => {
      const fontSizeValueFromAsync = await asyncStorage.getItem("fontSize");
      const parsed = Number(fontSizeValueFromAsync);
      setFontSizeInitialValue(
        Number.isFinite(parsed) && parsed > 0 ? parsed : 2,
      );
    })();

    (async () => {
      const lineHeightValueFromAsync = await asyncStorage.getItem("lineHeight");
      const parsed = Number(lineHeightValueFromAsync);
      setLineHeightValue(Number.isFinite(parsed) && parsed > 0 ? parsed : 1.4);
    })();
  }, []);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const fontSize = 10 + fontSizeInitialValue * 4;
  const lineHeight = Math.round(fontSize * lineHeightValue);
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
    : { left: 24, right: 24 };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={"chevron.left"}
          variant="plain"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <SafeAreaView
        style={[styles.screen, { backgroundColor: theme.colors.card }]}
      >
        <View
          style={[
            styles.scriptOverlay,
            overlayPositionStyle,
            {
              maxHeight: isLandscape ? "100%" : "50%",
              top: isLandscape ? 10 : 20,
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
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </ScrollView>
        </View>

        <Host style={[styles.sliderHost, sliderPositionStyle]}>
          <VStack>
            <SwiftText>Line Height</SwiftText>
            <Spacer />
            <Spacer />
            <Slider
              value={lineHeightValue}
              min={1}
              max={5}
              step={0.1}
              label={<SwiftText>Height</SwiftText>}
              minimumValueLabel={<SwiftText>1.0</SwiftText>}
              maximumValueLabel={<SwiftText>5.0</SwiftText>}
              onValueChange={(value) => {
                setLineHeightValue(value);
                asyncStorage.setItem("lineHeight", value.toString());
              }}
            />
          </VStack>
        </Host>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F3F5",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  scriptScrollContent: {
    paddingBottom: 8, // breathing room at the bottom
  },
  scriptOverlay: {
    position: "absolute",
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    maxHeight: "50%",
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
});
