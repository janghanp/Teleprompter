import { Pressable, StyleSheet, Text, View } from "react-native";

type CtaButtonProps = {
  title: string;
  pressHandler: () => void;
};

export default function CtaButton({ title, pressHandler }: CtaButtonProps) {
  return (
    <View style={styles.ctaWrap}>
      <Pressable style={styles.ctaButton} onPress={pressHandler}>
        <Text style={styles.ctaText}>{title}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaWrap: {
    marginTop: 24,
    alignItems: "center",
  },
  ctaButton: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#0B0B0B",
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
