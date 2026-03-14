import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding1" options={{ headerShown: false }} />
      <Stack.Screen name="OnBoarding2" options={{ headerShown: false }} />
      <Stack.Screen name="OnBoarding3" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
