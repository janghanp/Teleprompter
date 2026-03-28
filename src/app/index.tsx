import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import migrations from "../../drizzle/migrations";
import { createMMKV } from "react-native-mmkv";

const expo = SQLite.openDatabaseSync("db.db");
export const db = drizzle(expo);

export const MMKVStorage = createMMKV();

export default function Index() {
  const router = useRouter();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    // !success means processing
    if (error) {
      console.error("Migration error:", error);
    }

    if (success) {
      console.log("Migration success:", success);
    }
  }, [success, error]);

  useEffect(() => {
    const onboardingCompleted = MMKVStorage.getBoolean("onboardingCompleted");

    if (onboardingCompleted) {
      router.replace("/(tabs)/scripts");
    } else {
      router.replace("/OnBoarding1");
    }
  }, []);

  return null;
}
