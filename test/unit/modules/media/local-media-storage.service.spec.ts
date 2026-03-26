import path from "path";
import crypto from "crypto";
import { LocalMediaStorageService } from "../../../../src/modules/media/infra/storage/local-media-storage.service";

// Mocka tudo que faz I/O via paths
jest.mock("@/core/config/paths", () => {
  const actual = jest.requireActual("@/core/config/paths");
  return {
    ...actual,
    ensureDir: jest.fn(async () => undefined),
    writeBufferFile: jest.fn(async () => undefined),
  };
});

import { ensureDir, writeBufferFile } from "../../../../src/core/config/paths";

describe("LocalMediaStorageService", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("deve criar diretório e salvar arquivo, retornando path público quando publicBasePath existir", async () => {
    jest.spyOn(crypto, "randomUUID").mockReturnValue("uuid-1-uuid-1-uuid-1-uuid-1");

    const svc = new LocalMediaStorageService({
      rootDir: "/tmp/uploads",
      publicBasePath: "/uploads",
    });

    const buffer = Buffer.from("hello");
    const result = await svc.save({
      filename: "foto.png",
      mimeType: "image/png",
      buffer,
      folder: "/users/10",
      visibility: "public",
    });

    // dir normalizado (remove / inicial)
    expect(ensureDir).toHaveBeenCalledWith(path.join("/tmp/uploads", "public", "users/10"));

    // arquivo salvo
    expect(writeBufferFile).toHaveBeenCalledWith(
      path.join("/tmp/uploads/public", "users/10", "uuid-1-uuid-1-uuid-1-uuid-1.png"),
      buffer
    );

    // retorno
    expect(result).toEqual({
      path: "/uploads/public/users/10/uuid-1-uuid-1-uuid-1-uuid-1.png",
      size: 5,
      mimeType: "image/png",
    });
  });

  it("deve retornar filePath quando publicBasePath não existir", async () => {
    jest.spyOn(crypto, "randomUUID").mockReturnValue("uuid-2-uuid-2-uuid-2-uuid-2");

    const svc = new LocalMediaStorageService({
      rootDir: "/tmp/uploads",
    });

    const buffer = Buffer.from("abc");
    const result = await svc.save({
      filename: "doc.txt",
      mimeType: "text/plain",
      buffer,
      folder: "docs",
    });

    expect(result.path).toBe(path.join("/tmp/uploads", "docs", "uuid-2-uuid-2-uuid-2-uuid-2.txt"));
    expect(result.size).toBe(3);
  });
});