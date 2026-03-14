import { Stack } from "expo-router";

export default function CameraViewLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "",
          headerLargeTitleEnabled: true,
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
