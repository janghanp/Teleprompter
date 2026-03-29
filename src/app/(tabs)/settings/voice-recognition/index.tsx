import { TabBarContext } from "@/context/TabBarContext";
import { useTheme } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { use } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Form, Host, Section, Toggle } from "@expo/ui/swift-ui";
import {
  background,
  scrollContentBackground,
} from "@expo/ui/swift-ui/modifiers";

export default function VoiceRecognitionScreen() {
  const theme = useTheme();
  const { setIsTabBarHidden } = use(TabBarContext);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  return (
    <Host matchContents style={{ flex: 1 }}>
      <Form
        modifiers={[
          scrollContentBackground("hidden"),
          background(theme.colors.background),
        ]}
      >
        <Section>
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
          <Toggle
            isOn={true}
            onIsOnChange={() => {}}
            label={"Enable Dictation"}
          />
        </Section>
      </Form>
    </Host>
  );
}

const styles = StyleSheet.create({
  screen: {},
});
