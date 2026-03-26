import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "crypto";
import {
  MediaStorageService,
  SaveMediaInput,
  SaveMediaOutput,
} from "../../domain/services/media-storage.service";
import { resolveUploadExtension } from "./resolve-upload-extension";

export interface S3MediaStorageConfig {
  bucket: string;
  region: string;
  publicBaseUrl: string;
  /** Prefixo das chaves públicas, ex. "public" → public/cities/uuid.png */
  publicKeyPrefix: string;
  defaultStorageClass: string;
}

export class S3MediaStorageService implements MediaStorageService {
  private readonly client: S3Client;

  constructor(private readonly cfg: S3MediaStorageConfig) {
    this.client = new S3Client({ region: cfg.region });
  }

  private buildObjectKey(folder: string | undefined, fileName: string): string {
    const prefix = this.cfg.publicKeyPrefix.replace(/^\/+|\/+$/g, "");
    const sub = folder?.replace(/^\/+|\/+$/g, "") ?? "";
    const parts = [prefix, sub, fileName].filter((p) => p.length > 0);
    return parts.join("/");
  }

  private normalizeBaseUrl(): string {
    return this.cfg.publicBaseUrl.replace(/\/+$/, "");
  }

  async save(input: SaveMediaInput): Promise<SaveMediaOutput> {
    const ext = resolveUploadExtension(input.filename, input.mimeType);
    const safeName = `${crypto.randomUUID()}${ext}`;

    const folder = input.folder?.replace(/^\//, "") ?? "";
    const key = this.buildObjectKey(folder || undefined, safeName);

    const isPublic = input.visibility === "public";

    const storageClass = (input.storageClass ?? this.cfg.defaultStorageClass) as
      PutObjectCommandInput["StorageClass"];

    const objCommand: PutObjectCommandInput = {
      Bucket: this.cfg.bucket,
      Key: key,
      Body: input.buffer,
      ContentType: input.mimeType,
      CacheControl: "public, max-age=31536000, immutable",
      StorageClass: storageClass,
    };

    await this.client.send(new PutObjectCommand(objCommand));

    const url = isPublic
      ? `${this.normalizeBaseUrl()}/${key}`
      : undefined;

    return {
      path: `s3://${this.cfg.bucket}/${key}`,
      url,
      size: input.buffer.length,
      mimeType: input.mimeType,
    };
  }

  async deleteIfOwnedPublicUrl(url: string): Promise<void> {
    const base = this.normalizeBaseUrl();
    const trimmed = url.trim();
    if (!trimmed.startsWith(base)) return;

    const key = trimmed.slice(base.length).replace(/^\//, "");
    if (!key) return;

    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.cfg.bucket, Key: key }),
    );
  }
}
