// src/modules/media/domain/services/media-storage.service.ts
export type MediaVisibility = "private" | "public";

export interface SaveMediaInput {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  visibility?: MediaVisibility;
  folder?: string;
  /** Classe S3 (ex.: INTELLIGENT_TIERING). Ignorado em armazenamento local. */
  storageClass?: string;
}

export interface SaveMediaOutput {
  path: string;
  url?: string;
  size: number;
  mimeType: string;
}

export interface MediaStorageService {
  save(input: SaveMediaInput): Promise<SaveMediaOutput>;
  /** Remove objeto apenas se a URL pública pertencer a este storage (mesmo bucket/prefixo ou disco local). */
  deleteIfOwnedPublicUrl(url: string): Promise<void>;
}