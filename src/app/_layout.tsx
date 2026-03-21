import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
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
          <Stack.Screen name="camera_view" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
