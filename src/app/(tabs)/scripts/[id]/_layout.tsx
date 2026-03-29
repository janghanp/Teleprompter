import { Stack } from "expo-router";

export default function ScriptDetailLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
