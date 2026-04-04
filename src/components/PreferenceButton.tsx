import { StyleSheet } from "react-native";
import {
  BottomSheet,
  Button,
  Form,
  Group,
  Host,
  HStack,
  Image,
  Picker,
  Section,
  Slider,
  Spacer,
  Text,
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
  pickerStyle,
  presentationDetents,
  presentationDragIndicator,
  tag,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import {
  useMMKVBoolean,
  useMMKVNumber,
  useMMKVString,
} from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  frameRateOptions,
  resolutionOptions,
  stabilizationOptions,
} from "@/utils";
import { upperFirst } from "lodash";

export default function PreferenceButton() {
  const insets = useSafeAreaInsets();

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
  const [MMKVScrollSpeed, setMMKVScrollSPeed] = useMMKVNumber("scrollSpeed");
  const [MMKVResolution, setMMKVResolution] = useMMKVString("resolution");
  const [MMKVFrameRate, setMMKVFrameRate] = useMMKVNumber("frameRate");
  const [MMKVStabilization, setMMKVStabilization] =
    useMMKVString("stabilization");

  const pressHandler = () => {
    setIsPresented(true);
  };

  return (
    <Host style={[styles.container, { bottom: insets.bottom }]}>
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
            <Section title={"Script"}>
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
              <Section title={""}>
                <VStack alignment={"leading"}>
                  <SwiftText>Scroll Speed</SwiftText>
                  <Spacer />
                  <Spacer />
                  <Slider
                    value={MMKVScrollSpeed}
                    min={5}
                    max={50}
                    step={1}
                    label={<SwiftText>Speed</SwiftText>}
                    minimumValueLabel={<SwiftText>1</SwiftText>}
                    maximumValueLabel={<SwiftText>10</SwiftText>}
                    onValueChange={(value) => {
                      setMMKVScrollSPeed(value);
                    }}
                    modifiers={[]}
                  />
                </VStack>
              </Section>
            </Section>
            <Section title={"Camera"}>
              <Picker
                label={"Resolution"}
                modifiers={[pickerStyle("menu")]}
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
              <Picker
                label={"Frame Rate"}
                modifiers={[pickerStyle("menu")]}
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
              <Picker
                label={"Stabilization"}
                modifiers={[pickerStyle("menu")]}
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
        </Group>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 25,
    width: 50,
    height: 50,
    zIndex: 100,
    elevation: 10,
  },
});
