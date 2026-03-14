import { TabBarContext } from "@/context/TabBarContext";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useState } from "react";
import { DynamicColorIOS } from "react-native";

export default function TabLayout() {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  return (
    <TabBarContext value={{ setIsTabBarHidden }}>
      <NativeTabs
        hidden={isTabBarHidden}
        labelStyle={{
          // For the text color
          color: DynamicColorIOS({
            dark: "white",
            light: "black",
          }),
        }}
        // For the selected icon color
        tintColor={DynamicColorIOS({
          dark: "white",
          light: "black",
        })}
      >
        <NativeTabs.Trigger name="home">
          <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "house", selected: "house.fill" }}
            md="home"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "gearshape", selected: "gearshape.fill" }}
            md="settings"
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </TabBarContext>
  );
}
