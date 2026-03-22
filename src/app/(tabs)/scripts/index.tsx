import ScriptItem from "@/components/ScriptItem";
import { useCreateScript } from "@/hooks/useCreateScript";
import { useGetAllScripts } from "@/hooks/useGetAllScripts";
import { CreateScriptInput, Script } from "@/utils/interfaces";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const PORTRAIT_COLUMNS = 3;
const LANDSCAPE_COLUMNS = 4;
const BASE_COLUMN_GAP = 12;
const BASE_ROW_GAP = 20;
const BASE_LIST_PADDING = 16;

export default function ScriptsScreen() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const { createScript } = useCreateScript();
  const {
    scripts,
    scriptsError,
    isScriptsLoading,
    isScriptsRefreshing,
    refetchScripts,
  } = useGetAllScripts();

  const isLandscape = width > height;
  const gridColumns = isLandscape ? LANDSCAPE_COLUMNS : PORTRAIT_COLUMNS;
  const columnGap = isLandscape ? 8 : BASE_COLUMN_GAP;
  const rowGap = isLandscape ? 12 : BASE_ROW_GAP;
  const listPadding = isLandscape ? 12 : BASE_LIST_PADDING;
  const itemSize =
    (width - listPadding * 2 - columnGap * (gridColumns - 1)) / gridColumns;

  const pressHandler = () => {
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
  };

  const renderItem = ({ item, index }: { item: Script; index: number }) => {
    const isRowEnd = (index + 1) % gridColumns === 0;
    const titleText = (item.title ?? "").trim();
    const title =
      titleText.length > 20 ? `${titleText.slice(0, 20)}...` : titleText;

    return (
      <View
        style={[
          styles.itemContainer,
          {
            width: itemSize,
            marginRight: isRowEnd ? 0 : columnGap,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ScriptItem script={item} />
        <Text
          numberOfLines={1}
          style={[styles.title, { color: theme.colors.text }]}
        >
          {title}
        </Text>
      </View>
    );
  };

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
        numColumns={gridColumns}
        key={`scripts-grid-${gridColumns}`}
        renderItem={renderItem}
        columnWrapperStyle={[styles.columnWrapper, { marginBottom: rowGap }]}
        contentContainerStyle={[
          styles.listContent,
          { padding: listPadding, paddingBottom: listPadding + 80 },
        ]}
        refreshing={isScriptsRefreshing}
        onRefresh={refetchScripts}
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
  listContent: {},
  columnWrapper: {
    justifyContent: "flex-start",
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
