import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  saveHandler?: () => void;
}

export default function RecordingSaveButton({ saveHandler }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      style={[
        styles.saveButton,
        { backgroundColor: theme.colors.card, bottom: insets.bottom },
      ]}
      onPress={saveHandler}
    >
      <Text style={[styles.saveButtonText, { color: theme.colors.text }]}>
        Save
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    zIndex: 100,
    elevation: 10,
  },
  saveButtonText: {
    fontSize: 20,
  },
});
