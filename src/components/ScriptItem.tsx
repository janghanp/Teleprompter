import { useDeleteScript } from "@/hooks/useDeleteScript";
import { useUpdateScript } from "@/hooks/useUpdateScript";
import { Script, UpdateScriptInput } from "@/utils/interfaces";
import { Button, ContextMenu, Host, Text, VStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  background,
  font,
  frame,
  onTapGesture,
  padding,
  shapes,
  truncationMode,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

interface Props {
  script: Script;
}

export default function ScriptItem({ script }: Props) {
  const router = useRouter();
  const { deleteScript } = useDeleteScript();
  const { updateScript } = useUpdateScript();
  const { content } = script;
  const previewText = (content ?? "").trim();
  const preview =
    previewText.length > 50 ? `${previewText.slice(0, 50)}...` : previewText;

  const pressHandler = () => {
    router.push(`/scripts/${script.id}`);
  };

  const deleteHandler = () => {
    deleteScript(script.id);
  };

  const renameTitleHandler = () => {
    Alert.prompt("New title", "Enter a new title of the script", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update Title",
        onPress: (text?: string) => {
          if (text === undefined || text.trim() === "") return;

          const updatedScript: UpdateScriptInput = {
            id: script.id,
            title: text,
            content: script.content,
          };

          updateScript(updatedScript);
        },
      },
    ]);
  };

  return (
    <Host matchContents>
      <ContextMenu>
        <ContextMenu.Items>
          <Button
            label="Rename"
            systemImage="pencil.and.ellipsis.rectangle"
            onPress={renameTitleHandler}
          />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={deleteHandler}
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
              onTapGesture(pressHandler),
            ]}
          >
            <Text modifiers={[font({ size: 12 }), truncationMode("tail")]}>
              {preview}
            </Text>
          </VStack>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
