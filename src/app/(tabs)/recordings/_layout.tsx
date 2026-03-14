import { Stack } from "expo-router";

export default function RecordingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerLargeTitleEnabled: true,
          headerTitle: "Recordings",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
