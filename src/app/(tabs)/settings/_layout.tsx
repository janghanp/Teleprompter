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
      <Stack.Screen
        name="script"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="scrollspeed"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Stack.Screen
        name="voice-recognition"
        options={{
          title: "Voice Recognition",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          title: "Camera",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
