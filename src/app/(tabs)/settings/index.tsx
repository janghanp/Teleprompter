import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Text,
  Toggle,
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
                color={theme.colors.text}
                size={20}
                modifiers={[
                  frame({ width: 40, height: 40 }),
                  background(`${theme.colors.background}`),
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
                color={theme.colors.text}
                size={20}
                modifiers={[
                  frame({ width: 40, height: 40 }),
                  background(`${theme.colors.background}`),
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
          {/* <Button
            onPress={() => {
              router.push("/settings/voice-recognition");
            }}
          >
            <HStack spacing={10}>
              <Image
                systemName="mic.and.signal.meter"
                color={theme.colors.text}
                size={20}
                modifiers={[
                  frame({ width: 40, height: 40 }),
                  background(`${theme.colors.background}`),
                  clipShape("roundedRectangle"),
                ]}
              />
              <Text
                modifiers={[
                  foregroundStyle({ type: "color", color: theme.colors.text }),
                ]}
              >
                Voice Recognition
              </Text>
              <Spacer />
              <Image systemName="chevron.right" size={18} color="secondary" />
            </HStack>
          </Button> */}
        </Section>
      </Form>
    </Host>
  );
}
