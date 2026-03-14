import { Stack } from "expo-router";

export default function ScriptsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "Scripts",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
