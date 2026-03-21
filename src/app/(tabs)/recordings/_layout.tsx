import { Stack } from "expo-router";

export default function RecordingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Recordings",
          headerLargeTitleEnabled: true,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="[name]"
        options={{
          headerTitle: "",
          headerLargeTitleEnabled: true,
          headerTransparent: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
