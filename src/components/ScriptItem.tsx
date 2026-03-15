import { Script } from "@/utils/interfaces";
import { Button, ContextMenu, Host, Text, VStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  background,
  font,
  frame,
  padding,
  shapes,
  truncationMode,
} from "@expo/ui/swift-ui/modifiers";

interface Props {
  script: Script;
}

export default function ScriptItem({ script }: Props) {
  const { content } = script;
  const previewText = (content ?? "").trim();
  const preview =
    previewText.length > 20 ? `${previewText.slice(0, 20)}...` : previewText;

  return (
    <Host matchContents>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Rename"
            systemImage="pencil.and.ellipsis.rectangle"
            onPress={() => console.log("Edit")}
          />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={() => console.log("Delete")}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <VStack
            alignment="leading"
            modifiers={[
              padding({ all: 8 }),
              frame({ width: 100, height: 100, alignment: "topLeading" }),
              background(
                "white",
                shapes.roundedRectangle({ cornerRadius: 11 }),
              ),
              aspectRatio({ ratio: 1, contentMode: "fit" }),
            ]}
          >
            <Text modifiers={[font({ size: 12 }), truncationMode("tail")]}>
              {preview || "No content"}
            </Text>
          </VStack>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
