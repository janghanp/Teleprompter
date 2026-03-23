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
          color: DynamicColorIOS({
            dark: "white",
            light: "black",
          }),
        }}
        tintColor={DynamicColorIOS({
          dark: "white",
          light: "black",
        })}
      >
        <NativeTabs.Trigger name="scripts">
          <NativeTabs.Trigger.Label>Scripts</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "doc.text", selected: "doc.text.fill" }}
            md="description"
          />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="recordings">
          <NativeTabs.Trigger.Label>Recordings</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: "video", selected: "video.fill" }}
            md="fiber_manual_record"
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
