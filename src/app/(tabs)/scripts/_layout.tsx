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
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          headerTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
