import { Stack, useRouter } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  function pressHandler() {
    router.push("/home/camera_view");
  }

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"video.fill"}
          tintColor={"red"}
          variant="plain"
          onPress={pressHandler}
        />
      </Stack.Toolbar>
      <ScrollView
        style={{ padding: 16 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
        <Text>Note content...</Text>
      </ScrollView>
    </>
  );
}
