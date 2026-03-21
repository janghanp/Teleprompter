import { VideoThumbnail } from "expo-video";

export interface CreateScriptInput {
  title: string;
  content?: string;
}

export interface UpdateScriptInput {
  id: number;
  title: string;
  content?: string | null;
}

export interface Script {
  id: number;
  title: string;
  content: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface RecordingItemType {
  name: string;
  uri: string;
  size: number | null;
  modified: number | null;
  thumbnail: VideoThumbnail | null;
}
