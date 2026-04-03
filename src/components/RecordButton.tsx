import { Pressable, View, StyleSheet } from "react-native";

interface Props {
  pressHandler: () => void;
}

export default function RecordButton({ pressHandler }: Props) {
  return (
    <Pressable
      style={[styles.playPauseButton, { bottom: 0 }]}
      onPress={pressHandler}
    >
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: "#e60000",
          borderRadius: 100,
        }}
      ></View>
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
