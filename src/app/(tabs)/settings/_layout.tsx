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
        name="fontsize"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="scrollspeed"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="lineheight"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
