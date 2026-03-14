import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "Settings",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
