import { StyleSheet } from "react-native";
import {
  BottomSheet,
  Button,
  Form,
  Group,
  Host,
  HStack,
  Image,
  Section,
  Slider,
  Spacer,
  Text as SwiftText,
  VStack,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  font,
  frame,
  labelStyle,
  padding,
  presentationDetents,
  presentationDragIndicator,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { useMMKVBoolean, useMMKVNumber } from "react-native-mmkv";

export default function PreferenceButton() {
  const [isPresented, setIsPresented] = useState(false);
  const [MMKVFontSize, setMMKVFontSize] = useMMKVNumber("fontSize");
  const [MMKVLineHeight, setMMKVLineHeight] = useMMKVNumber("lineHeight");
  const [MMKVScriptBackgroundOpacity, setMMKVScriptBackgroundOpacity] =
    useMMKVNumber("scriptBackgroundOpacity");
  const [MMKVScriptIndicatorStyle0, setMMKVScriptIndicatorStyle0] =
    useMMKVBoolean("scriptIndicatorStyle0");
  const [MMKVScriptIndicatorStyle1, setMMKVScriptIndicatorStyle1] =
    useMMKVBoolean("scriptIndicatorStyle1");
  const [MMKVScriptIndicatorStyle2, setMMKVScriptIndicatorStyle2] =
    useMMKVBoolean("scriptIndicatorStyle2");

  const pressHandler = () => {
    setIsPresented(true);
  };

  return (
    <Host style={styles.container}>
      <Button
        label={"Preference"}
        systemImage={"gear"}
        onPress={pressHandler}
        modifiers={[
          font({ size: 22 }),
          tint("clear"),
          buttonStyle("glassProminent"),
          labelStyle("iconOnly"),
          controlSize("large"),
        ]}
      />
      <BottomSheet
        isPresented={isPresented}
        onIsPresentedChange={setIsPresented}
        modifiers={[tint("black")]}
      >
        <Group
          modifiers={[
            presentationDragIndicator("visible"),
            presentationDetents(["medium"]),
          ]}
        >
          <Form>
            <Section title={"Preference"}>
              <Section title={""}>
                <VStack alignment={"leading"}>
                  <SwiftText>Font Size</SwiftText>
                  <Spacer />
                  <Spacer />
                  <Slider
                    value={MMKVFontSize}
                    min={1}
                    max={10}
                    step={0.5}
                    label={<SwiftText>Size</SwiftText>}
                    minimumValueLabel={<SwiftText>1</SwiftText>}
                    maximumValueLabel={<SwiftText>10</SwiftText>}
                    onValueChange={(value) => {
                      setMMKVFontSize(value);
                    }}
                  />
                </VStack>
              </Section>
              <Section>
                <VStack alignment={"leading"}>
                  <SwiftText>Line Height</SwiftText>
                  <Spacer />
                  <Spacer />
                  <Slider
                    value={MMKVLineHeight}
                    min={1}
                    max={10}
                    step={0.5}
                    minimumValueLabel={<SwiftText>1</SwiftText>}
                    maximumValueLabel={<SwiftText>10</SwiftText>}
                    onValueChange={(value) => {
                      setMMKVLineHeight(value);
                    }}
                  />
                </VStack>
              </Section>
              <Section>
                <VStack alignment={"leading"}>
                  <SwiftText>Background Opacity</SwiftText>
                  <Spacer />
                  <Spacer />
                  <Slider
                    value={MMKVScriptBackgroundOpacity}
                    min={1}
                    max={10}
                    step={0.5}
                    minimumValueLabel={<SwiftText>1</SwiftText>}
                    maximumValueLabel={<SwiftText>10</SwiftText>}
                    onValueChange={(value) => {
                      setMMKVScriptBackgroundOpacity(value);
                    }}
                  />
                </VStack>
              </Section>
              <Section>
                <VStack alignment={"leading"}>
                  <SwiftText>Indicator</SwiftText>
                  <Spacer />
                  <Spacer />
                  <HStack
                    spacing={8}
                    alignment={"center"}
                    modifiers={[frame({ maxWidth: Infinity })]}
                  >
                    <Button
                      onPress={() => {
                        setMMKVScriptIndicatorStyle0((prev) => !prev);
                      }}
                      modifiers={[
                        buttonStyle(
                          MMKVScriptIndicatorStyle0
                            ? "glassProminent"
                            : "glass",
                        ),
                        frame({ maxWidth: 9999 }),
                      ]}
                    >
                      <HStack
                        alignment="center"
                        modifiers={[
                          padding({ vertical: 6, horizontal: 12 }),
                          frame({
                            height: 32,
                            maxWidth: 9999,
                            alignment: "center",
                          }),
                        ]}
                      >
                        <Image systemName={"chevron.right"} size={16} />
                      </HStack>
                    </Button>
                    <Button
                      onPress={() => {
                        setMMKVScriptIndicatorStyle1((prev) => !prev);
                      }}
                      modifiers={[
                        buttonStyle(
                          MMKVScriptIndicatorStyle1
                            ? "glassProminent"
                            : "glass",
                        ),
                        frame({ maxWidth: 9999 }),
                      ]}
                    >
                      <HStack
                        alignment="center"
                        modifiers={[
                          padding({ vertical: 6, horizontal: 12 }),
                          frame({
                            height: 32,
                            maxWidth: 9999,
                            alignment: "center",
                          }),
                        ]}
                      >
                        <Image systemName={"minus"} size={16} />
                      </HStack>
                    </Button>
                    <Button
                      onPress={() => {
                        setMMKVScriptIndicatorStyle2((prev) => !prev);
                      }}
                      modifiers={[
                        buttonStyle(
                          MMKVScriptIndicatorStyle2
                            ? "glassProminent"
                            : "glass",
                        ),
                        frame({ maxWidth: 9999 }),
                      ]}
                    >
                      <HStack
                        alignment="center"
                        modifiers={[
                          padding({ vertical: 6, horizontal: 12 }),
                          frame({
                            height: 32,
                            maxWidth: 9999,
                            alignment: "center",
                          }),
                        ]}
                      >
                        <Image systemName={"chevron.left"} size={16} />
                      </HStack>
                    </Button>
                  </HStack>
                </VStack>
              </Section>
            </Section>
          </Form>
        </Group>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 30,
    bottom: 40,
    width: 50,
    height: 50,
    zIndex: 100,
    elevation: 10,
  },
});
