import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Text,
} from "@expo/ui/swift-ui";
import { useRouter } from "expo-router";
import {
  background,
  clipShape,
  foregroundStyle,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import { useTheme } from "@react-navigation/native";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section title="Preferences">
          <Button
            onPress={() => {
              router.push("/settings/script");
            }}
          >
            <HStack spacing={10}>
              <Image
                systemName="text.word.spacing"
                color="white"
                size={20}
                modifiers={[
                  frame({ width: 40, height: 40 }),
                  background(`${theme.colors.text}`),
                  clipShape("roundedRectangle"),
                ]}
              />
              <Text
                modifiers={[
                  foregroundStyle({ type: "color", color: theme.colors.text }),
                ]}
              >
                Script
              </Text>
              <Spacer />
              <Image systemName="chevron.right" size={18} color="secondary" />
            </HStack>
          </Button>
          <Button
            onPress={() => {
              router.push("/settings/scrollspeed");
            }}
          >
            <HStack spacing={10}>
              <Image
                systemName="scroll"
                color="white"
                size={20}
                modifiers={[
                  frame({ width: 40, height: 40 }),
                  background(`${theme.colors.text}`),
                  clipShape("roundedRectangle"),
                ]}
              />
              <Text
                modifiers={[
                  foregroundStyle({ type: "color", color: theme.colors.text }),
                ]}
              >
                Scroll Speed
              </Text>
              <Spacer />
              <Image systemName="chevron.right" size={18} color="secondary" />
            </HStack>
          </Button>
        </Section>
      </Form>
    </Host>
  );
}
