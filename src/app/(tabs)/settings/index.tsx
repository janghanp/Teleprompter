import { Button, Form, Host, Section } from "@expo/ui/swift-ui";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

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
        </Section>
      </Form>
    </Host>
  );
}

const styles = StyleSheet.create({});
