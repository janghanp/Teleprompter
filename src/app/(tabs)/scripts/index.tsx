import { Stack } from "expo-router";
import { Alert, ScrollView } from "react-native";

export default function ScriptsScreen() {
  function pressHandler() {
    Alert.prompt("New Script", "Enter a name of the new script", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create Script",
        onPress: (text?: string) => {
          // Save to local DB
          // db.insert(scriptsTable)
          //   .values({
          //     title: text || "Untitled Script",
          //     content: "",
          //     createdAt: new Date().toUTCString(),
          //     updatedAt: new Date().toUTCString(),
          //   });
        },
      },
    ]);
  }

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"plus"}
          variant="plain"
          onPress={pressHandler}
        />
      </Stack.Toolbar>
      <ScrollView
        style={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      ></ScrollView>
    </>
  );
}
