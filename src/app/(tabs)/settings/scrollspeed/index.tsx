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
import * as SecureStore from "expo-secure-store";
import { use, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScrollSpeedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setIsTabBarHidden } = use(TabBarContext);
  const fontSizeInitialValue = SecureStore.getItem("fontSize");
  const scrollSpeedInitialValue = SecureStore.getItem("scrollSpeed");
  const [scrollSpeedValue, setScrollSpeedValue] = useState(
    Number(scrollSpeedInitialValue) || 2,
  );
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  useEffect(() => {
    if (!scrollSpeedValue) {
      return;
    }

    // clear the previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const speedPxPerSec = 6 + scrollSpeedValue * 5;
    const intervalMs = 16;
    const step = (speedPxPerSec * intervalMs) / 1000;

    intervalRef.current = setInterval(() => {
      scrollY.current += step;
      scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [scrollSpeedValue]);

  useEffect(() => {
    SecureStore.setItem("scrollSpeed", scrollSpeedValue.toString());
  }, [scrollSpeedValue]);

  const handleScriptScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  };

  const fontSize = 10 + Number(fontSizeInitialValue) * 4;
  const lineHeight = Math.round(fontSize * 1.4);

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
        <View style={styles.scriptOverlay}>
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

        <Host matchContents style={styles.sliderHost}>
          <VStack>
            <SwiftText>Scroll Speed</SwiftText>
            <Spacer />
            <Spacer />
            <Slider
              value={scrollSpeedValue}
              min={1}
              max={20}
              step={1}
              label={<SwiftText>Speed</SwiftText>}
              minimumValueLabel={<SwiftText>1</SwiftText>}
              maximumValueLabel={<SwiftText>10</SwiftText>}
              onValueChange={setScrollSpeedValue}
              modifiers={[]}
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
    paddingBottom: 8,
  },
  scriptOverlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
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
    left: 24,
    right: 24,
    bottom: 60,
  },
});
