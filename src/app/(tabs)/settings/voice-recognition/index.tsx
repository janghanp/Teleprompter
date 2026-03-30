import { TabBarContext } from "@/context/TabBarContext";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { use, useState } from "react";
import { Form, Host, RNHostView, Section, Toggle } from "@expo/ui/swift-ui";
import {
  background,
  scrollContentBackground,
  tint,
  toggleStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useMMKVBoolean } from "react-native-mmkv";
import { Switch, Text } from "react-native";

export default function VoiceRecognitionScreen() {
  const theme = useTheme();
  const { setIsTabBarHidden } = use(TabBarContext);
  const [MMKVVoiceRecognition, setMMKVVoiceRecognition] =
    useMMKVBoolean("voiceRecognition");

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  console.log({ MMKVVoiceRecognition });

  return (
    <Host style={{ flex: 1, borderWidth: 1, borderColor: "red" }}>
      <Form
        modifiers={[
          scrollContentBackground("hidden"),
          background(theme.colors.background),
        ]}
      >
        <Section title="Voice Recognition">
          <RNHostView matchContents>
            <Switch
              value={MMKVVoiceRecognition}
              onValueChange={setMMKVVoiceRecognition}
            />
          </RNHostView>
        </Section>

        <Section title="Voice Recognition (SwiftUI)">
          <Toggle
            key="voice-recognition-toggle"
            isOn={MMKVVoiceRecognition}
            onIsOnChange={setMMKVVoiceRecognition}
            label={"Scroll with Voice"}
          />
        </Section>
      </Form>
    </Host>
  );
}
