import { Button, Form, Host, Section, Toggle } from "@expo/ui/swift-ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Preferences">
          <Button
            label="Font Size"
            onPress={() => {
              router.push("/(tabs)/settings/fontsize");
            }}
          />
          <Button
            label="Scroll Speed"
            onPress={() => {
              router.push("/(tabs)/settings/scrollspeed");
            }}
          />
          <Toggle
            label="Dark mode"
            isOn={darkMode}
            onIsOnChange={setDarkMode}
          />
        </Section>
      </Form>
    </Host>
  );
}

const styles = StyleSheet.create({});
