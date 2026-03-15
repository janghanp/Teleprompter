import ScriptItem from "@/components/ScriptItem";
import { useCreateScript } from "@/hooks/useCreateScript";
import { useGetAllScripts } from "@/hooks/useGetAllScripts";
import { CreateScriptInput, Script } from "@/utils/interfaces";
import { Stack } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const GRID_COLUMNS = 3;
const COLUMN_GAP = 12;
const ROW_GAP = 20;
const LIST_PADDING = 16;

export default function ScriptsScreen() {
  const { width } = useWindowDimensions();
  const { createScript } = useCreateScript();
  const { scripts, scriptsError, isScriptsLoading } = useGetAllScripts();
  const itemSize =
    (width - LIST_PADDING * 2 - COLUMN_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  function pressHandler() {
    Alert.prompt("New Script", "Enter a name of the new script", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create Script",
        onPress: (text?: string) => {
          const scripteToInsert: CreateScriptInput = {
            title: text || "Untitled Script",
            content: "",
          };

          createScript(scripteToInsert);
        },
      },
    ]);
  }

  function renderItem({ item, index }: { item: Script; index: number }) {
    const isRowEnd = (index + 1) % GRID_COLUMNS === 0;
    const titleText = (item.title ?? "").trim();
    const title =
      titleText.length > 20 ? `${titleText.slice(0, 20)}...` : titleText;

    return (
      <View
        style={[
          styles.itemContainer,
          { width: itemSize, marginRight: isRowEnd ? 0 : COLUMN_GAP },
        ]}
      >
        <ScriptItem script={item} />
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    );
  }

  const scriptItems = (scripts ?? []) as Script[];
  const statusMessage = isScriptsLoading
    ? "Loading scripts..."
    : scriptsError
      ? "Could not load scripts."
      : scriptItems.length === 0
        ? "No scripts yet."
        : "";

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon={"plus"}
          variant="plain"
          onPress={pressHandler}
        />
      </Stack.Toolbar>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={scriptItems}
        keyExtractor={(item) => String(item.id)}
        numColumns={GRID_COLUMNS}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          statusMessage ? (
            <Text style={styles.emptyText}>{statusMessage}</Text>
          ) : null
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: LIST_PADDING,
    paddingBottom: LIST_PADDING + 80,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: ROW_GAP,
  },
  itemContainer: {
    flexGrow: 0,
  },
  emptyText: {
    color: "#8A8A8A",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
});
