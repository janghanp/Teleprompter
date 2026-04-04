import { TabBarContext } from "@/context/TabBarContext";
import {
  frameRateOptions,
  resolutionOptions,
  stabilizationOptions,
} from "@/utils";
import { Form, Host, Picker, Section, Text } from "@expo/ui/swift-ui";
import {
  background,
  pickerStyle,
  scrollContentBackground,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { use } from "react";
import { useMMKVNumber, useMMKVString } from "react-native-mmkv";
import { upperFirst } from "lodash";

export default function CameraSettingsScreen() {
  const theme = useTheme();
  const { setIsTabBarHidden } = use(TabBarContext);

  const [MMKVResolution, setMMKVResolution] = useMMKVString("resolution");
  const [MMKVFrameRate, setMMKVFrameRate] = useMMKVNumber("frameRate");
  const [MMKVStabilization, setMMKVStabilization] =
    useMMKVString("stabilization");

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
        <Section title="Resolution">
          <Picker
            modifiers={[pickerStyle("inline")]}
            selection={MMKVResolution || "HD"}
            onSelectionChange={(selection) => {
              setMMKVResolution(selection);
            }}
          >
            {resolutionOptions.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>
        </Section>
        <Section title="Frame Rate">
          <Picker
            modifiers={[pickerStyle("inline")]}
            selection={MMKVFrameRate || 60}
            onSelectionChange={(selection) => {
              setMMKVFrameRate(selection);
            }}
          >
            {frameRateOptions.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option} fps
              </Text>
            ))}
          </Picker>
        </Section>
        <Section title="Stabilization">
          <Picker
            modifiers={[pickerStyle("inline")]}
            selection={MMKVStabilization || "auto"}
            onSelectionChange={(selection) => {
              setMMKVStabilization(selection);
            }}
          >
            {stabilizationOptions.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {upperFirst(option)}
              </Text>
            ))}
          </Picker>
        </Section>
      </Form>
    </Host>
  );
}
