import { TabBarContext } from "@/context/TabBarContext";
import { languageOptions } from "@/utils";
import { Form, Host, Picker, Section, Text, Toggle } from "@expo/ui/swift-ui";
import {
  background,
  pickerStyle,
  scrollContentBackground,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { Activity, use } from "react";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";

export default function VoiceRecognitionScreen() {
  const theme = useTheme();
  const { setIsTabBarHidden } = use(TabBarContext);
  const [MMKVVoiceRecognition, setMMKVVoiceRecognition] =
    useMMKVBoolean("voiceRecognition");
  const [MMKVLanguage, setMMKVLanguage] = useMMKVString("language");

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  return (
    <Host style={{ flex: 1, borderWidth: 1, borderColor: "red" }}>
      <Form
        modifiers={[
          scrollContentBackground("hidden"),
          background(theme.colors.background),
        ]}
      >
        <Section title="">
          <Toggle
            isOn={MMKVVoiceRecognition}
            onIsOnChange={setMMKVVoiceRecognition}
            label={"Auto Scroll with Voice"}
          />
        </Section>
        <Activity mode={MMKVVoiceRecognition ? "visible" : "hidden"}>
          <Section title="Language">
            <Picker
              modifiers={[pickerStyle("inline")]}
              selection={MMKVLanguage || languageOptions[0]}
              onSelectionChange={(selection) => {
                console.log(selection);
                setMMKVLanguage(selection);
              }}
            >
              {languageOptions.map((option) => (
                <Text key={option} modifiers={[tag(option)]}>
                  {option}
                </Text>
              ))}
            </Picker>
          </Section>
        </Activity>
      </Form>
    </Host>
  );
}
