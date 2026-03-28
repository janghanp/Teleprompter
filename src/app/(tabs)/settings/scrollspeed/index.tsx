import { TabBarContext } from "@/context/TabBarContext";
import {
  Host,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
} from "@expo/ui/swift-ui";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { use, useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import { useMMKVNumber } from "react-native-mmkv";

export default function ScrollSpeedScreen() {
  const theme = useTheme();
  const { setIsTabBarHidden } = use(TabBarContext);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [MMKVScrollSpeed, setMMKVScrollSPeed] = useMMKVNumber("scrollSpeed");
  const [MMKVFontSize] = useMMKVNumber("fontSize");
  const [MMKVLineHeight] = useMMKVNumber("lineHeight");
  const [MMKVScriptBackgroundOpacity] = useMMKVNumber(
    "scriptBackgroundOpacity",
  );
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  useEffect(() => {
    if (!MMKVScrollSpeed) {
      return;
    }

    // clear the previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const speedPxPerSec = 6 + MMKVScrollSpeed * 10;
    const intervalMs = 50;
    const step = (speedPxPerSec * intervalMs) / 1000;

    intervalRef.current = setInterval(() => {
      scrollY.current += step;
      scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [MMKVScrollSpeed]);

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

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
    : { left: 24, right: 24 };

  return (
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
            backgroundColor: overlayBackgroundColor,
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
        </ScrollView>
      </View>
      <Host style={[styles.sliderHost, sliderPositionStyle]}>
        <VStack>
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
      </Host>
    </SafeAreaView>
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
    paddingBottom: 8,
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
