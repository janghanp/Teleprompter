export const formatBytes = (bytes: number | null) => {
  if (bytes === null) {
    return "Unknown size";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  const mb = kb / 1024;

  return `${mb.toFixed(1)} MB`;
};

export function formatTime(seconds: number) {
  const totalSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const formatModified = (modified: number | null) => {
  if (!modified) return "";
  const modifiedMs = modified < 1_000_000_000_000 ? modified * 1000 : modified;
  const date = new Date(modifiedMs);
  if (Number.isNaN(date.getTime())) return "";
  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} ${timePart}`;
};

export const languageOptions = ["en-AU", "ko-KR"];
