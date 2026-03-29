import { TabBarContext } from "@/context/TabBarContext";
import { useGetScriptById } from "@/hooks/useGetScriptById";
import { useUpdateScript } from "@/hooks/useUpdateScript";
import { UpdateScriptInput } from "@/utils/interfaces";
import { useTheme } from "@react-navigation/native";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import React, { use, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";

export default function ScriptDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { script } = useGetScriptById(Number(id));
  const { updateScript } = useUpdateScript();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const [text, setText] = useState("");
  const debounced = useDebouncedCallback(() => {
    saveHandler(true);
  }, 1000);

  useEffect(() => {
    if (script && script.length > 0) {
      const scriptContent = script[0].content || "";

      setText(scriptContent);
    }
  }, [script]);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const saveHandler = (skipKeyboardDismiss?: boolean) => {
    if (!script || script.length === 0) return;

    const updatedScript: UpdateScriptInput = {
      id: script[0].id,
      title: script[0].title,
      content: text,
    };

    updateScript(updatedScript);

    if (!skipKeyboardDismiss) {
      Keyboard.dismiss();
    }
  };

  const goToCameraViewHandler = () => {
    saveHandler();
    router.push(`/camera_view?id=${id}`);
  };

  const goBackHandler = () => {
    saveHandler();
    router.back();
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={"chevron.left"}
          variant="plain"
          onPress={goBackHandler}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          variant="prominent"
          tintColor={"red"}
          onPress={goToCameraViewHandler}
        >
          • Rec
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Button variant="plain" onPress={saveHandler}>
          Save
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
        <KeyboardAvoidingView
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card,
            },
          ]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <TextInput
            style={[styles.editor, { color: theme.colors.text }]}
            multiline={true}
            placeholder="Start typing here..."
            value={text}
            onChangeText={(value) => {
              setText(value);
              debounced();
            }}
            textAlignVertical="top"
          />
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  editor: {
    flex: 1,
    padding: 20,
    fontSize: 18,
    lineHeight: 24,
    textAlignVertical: "top",
  },
});
