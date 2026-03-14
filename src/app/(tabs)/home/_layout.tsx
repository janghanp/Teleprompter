import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "Home",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="camera_view"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
