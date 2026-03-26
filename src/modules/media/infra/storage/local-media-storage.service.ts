import path from "path";
import crypto from "crypto";
import fs from "node:fs/promises";
import {
  ensureDir,
  joinFs,
  joinPublicPath,
  normalizeFolder,
  writeBufferFile,
} from "@/core/config/paths";
import {
  MediaStorageService,
  SaveMediaInput,
  SaveMediaOutput,
} from "../../domain/services/media-storage.service";
import { resolveUploadExtension } from "./resolve-upload-extension";

export interface LocalMediaStorageConfig {
  rootDir: string;
  publicBasePath?: string;
  /** Ex.: http://127.0.0.1:3000 — usado para montar URL pública e validar exclusões. */
  publicOrigin?: string;
  /** Mesmo conceito do S3: pasta lógica sob uploads, ex. "public". */
  publicKeyPrefix?: string;
}

export class LocalMediaStorageService implements MediaStorageService {
  constructor(private readonly cfg: LocalMediaStorageConfig) {}

  private prefixedFolder(input: SaveMediaInput): string {
    const isPublic = input.visibility === "public";
    const prefix = (this.cfg.publicKeyPrefix ?? "public").replace(/^\/+|\/+$/g, "");
    const folder = normalizeFolder(input.folder);
    if (!isPublic) return folder;
    return folder ? `${prefix}/${folder}` : prefix;
  }

  async save(input: SaveMediaInput): Promise<SaveMediaOutput> {
    const ext = resolveUploadExtension(input.filename, input.mimeType);
    const safeName = `${crypto.randomUUID()}${ext}`;

    const relFolder = this.prefixedFolder(input);
    const dir = joinFs(this.cfg.rootDir, relFolder);

    await ensureDir(dir);

    const filePath = path.join(dir, safeName);
    await writeBufferFile(filePath, input.buffer);

    const logicalPath = this.cfg.publicBasePath
      ? joinPublicPath(this.cfg.publicBasePath, relFolder, safeName)
      : filePath;

    const origin = this.cfg.publicOrigin?.replace(/\/+$/, "");
    const url =
      input.visibility === "public" && origin
        ? `${origin}${logicalPath}`
        : undefined;

    return {
      path: logicalPath,
      url,
      size: input.buffer.length,
      mimeType: input.mimeType,
    };
  }

  async deleteIfOwnedPublicUrl(url: string): Promise<void> {
    const origin = this.cfg.publicOrigin?.replace(/\/+$/, "");
    const basePath = this.cfg.publicBasePath;
    if (!origin || !basePath) return;

    const trimmed = url.trim();
    if (!trimmed.startsWith(origin)) return;

    const afterOrigin = trimmed.slice(origin.length);
    if (!afterOrigin.startsWith(basePath)) return;

    const relativeFromUploads = afterOrigin
      .slice(basePath.length)
      .replace(/^\//, "");
    if (!relativeFromUploads) return;

    const abs = path.join(this.cfg.rootDir, relativeFromUploads);
    const rootResolved = path.resolve(this.cfg.rootDir);
    const fileResolved = path.resolve(abs);
    if (!fileResolved.startsWith(rootResolved)) return;

    try {
      await fs.unlink(fileResolved);
    } catch {
      /* já removido ou inexistente */
    }
  }
}
