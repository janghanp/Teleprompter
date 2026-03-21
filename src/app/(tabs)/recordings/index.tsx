import RecordingItem from "@/components/RecordingItem";
import { useLoadRecordings } from "@/hooks/useLoadRecordings";
import { RecordingItemType } from "@/utils/interfaces";
import { useTheme } from "@react-navigation/native";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const GRID_COLUMNS = 3;
const COLUMN_GAP = 12;
const ROW_GAP = 20;
const LIST_PADDING = 16;

export default function RecordingsScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const itemSize =
    (width - LIST_PADDING * 2 - COLUMN_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const { recordings, recordingsError, isRecordingsLoading, loadRecordings } =
    useLoadRecordings();

  const renderItem = ({
    item,
    index,
  }: {
    item: RecordingItemType;
    index: number;
  }) => {
    const isRowEnd = (index + 1) % GRID_COLUMNS === 0;
    const titleText = (item.name ?? "").trim();
    const title =
      titleText.length > 20 ? `${titleText.slice(0, 20)}...` : titleText;

    return (
      <View
        style={[
          styles.itemContainer,
          { width: itemSize, marginRight: isRowEnd ? 0 : COLUMN_GAP },
        ]}
      >
        <RecordingItem
          item={item}
          key={item.uri}
          onDeleted={() => {
            void loadRecordings();
          }}
        />
        <Text
          numberOfLines={1}
          style={[styles.title, { color: theme.colors.text }]}
        >
          {title}
        </Text>
      </View>
    );
  };

  const statusMessage = isRecordingsLoading
    ? "Loading recordings..."
    : recordingsError
      ? "Could not load recordings."
      : recordings.length === 0
        ? "No recordings yet."
        : "";

  return (
    <>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={recordings}
        keyExtractor={(item) => item.uri}
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
