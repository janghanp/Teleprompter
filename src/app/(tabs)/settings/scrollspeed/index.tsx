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
            Let’s keep making communication easier, one message at a time.
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
            Let’s keep making communication easier, one message at a time.
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
