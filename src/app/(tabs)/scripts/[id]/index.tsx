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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScriptDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { script, isScriptLoading, scriptError } = useGetScriptById(Number(id));
  const { updateScript, isUpdateScriptPending } = useUpdateScript();
  const { setIsTabBarHidden } = use(TabBarContext);
  const router = useRouter();
  const [text, setText] = useState("");

  useEffect(() => {
    if (script && script.length > 0) {
      setText(script[0].content || "");
    }
  }, [script]);

  useFocusEffect(() => {
    setIsTabBarHidden(true);
    return () => setIsTabBarHidden(false);
  });

  const saveHandler = () => {
    if (!script || script.length === 0) return;

    const updatedScript: UpdateScriptInput = {
      id: script[0].id,
      title: script[0].title,
      content: text,
    };

    updateScript(updatedScript);
    Keyboard.dismiss();
  };

  const goToCameraViewhandler = () => {
    router.push(`/camera_view?id=${id}`);
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon={"chevron.left"}
          variant="plain"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          variant="prominent"
          tintColor={"red"}
          onPress={goToCameraViewhandler}
        >
          • Rec
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Button variant="plain" onPress={saveHandler}>
          Save
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.card }]}
      >
        <KeyboardAvoidingView
          style={[styles.container, { backgroundColor: theme.colors.card }]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <TextInput
            style={[styles.editor, { color: theme.colors.text }]}
            multiline={true}
            placeholder="Start typing here..."
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    marginTop: 50,
    fontSize: 18,
    lineHeight: 24,
    textAlignVertical: "top", // Crucial for Android
  },
});
