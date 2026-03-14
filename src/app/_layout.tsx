import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(onboarding)/OnBoarding1"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(onboarding)/OnBoarding2"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(onboarding)/OnBoarding3"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
