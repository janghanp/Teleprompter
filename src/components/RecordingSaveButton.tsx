import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

interface Props {
  saveHandler?: () => void;
}

export default function RecordingSaveButton({ saveHandler }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      style={[styles.saveButton, { backgroundColor: theme.colors.card }]}
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
    bottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    zIndex: 10,
    elevation: 10,
  },
  saveButtonText: {
    fontSize: 20,
  },
});
