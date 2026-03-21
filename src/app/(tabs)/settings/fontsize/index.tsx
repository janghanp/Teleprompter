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
import { use, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FontSizeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { setIsTabBarHidden } = use(TabBarContext);
  const fontSizeInitialValue = SecureStore.getItem("fontSize");
  const [fontSizeValue, setFontSizeValue] = useState(
    Number(fontSizeInitialValue) || 2,
  );

  useEffect(() => {
    SecureStore.setItem("fontSize", fontSizeValue.toString());
  }, [fontSizeValue]);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const fontSize = 10 + fontSizeValue * 4;
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

        <Host matchContents style={styles.sliderHost}>
          <VStack>
            <SwiftText>Font Size</SwiftText>
            <Spacer />
            <Spacer />
            <Slider
              value={fontSizeValue}
              min={1}
              max={10}
              step={1}
              label={<SwiftText>Size</SwiftText>}
              minimumValueLabel={<SwiftText>1</SwiftText>}
              maximumValueLabel={<SwiftText>10</SwiftText>}
              onValueChange={setFontSizeValue}
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
    paddingBottom: 8, // breathing room at the bottom
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
