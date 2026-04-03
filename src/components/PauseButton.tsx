import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
  pressHandler: () => void;
}

export default function PauseButton({ pressHandler }: Props) {
  return (
    <Pressable style={[styles.playPauseButton]} onPress={pressHandler}>
      <Ionicons name={"square"} size={30} color="#e60000" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  playPauseButton: {
    position: "absolute",
    bottom: 0,
    zIndex: 100,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
});
