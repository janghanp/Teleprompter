import { Stack } from "expo-router";

export default function ScrollSpeedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
