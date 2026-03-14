import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const onboardingCompleted = await SecureStore.getItemAsync(
        "onboardingCompleted",
      );

      if (onboardingCompleted === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/OnBoarding1");
      }
    })();
  }, []);

  return null;
}
