import crypto from "crypto";
import { S3MediaStorageService } from "../../../../src/modules/media/infra/storage/s3-media-storage.service";

const sendMock = jest.fn();

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn().mockImplementation(() => ({ send: sendMock })),
    PutObjectCommand: jest.fn().mockImplementation((input) => ({ input })),
  };
});

import { PutObjectCommand } from "@aws-sdk/client-s3";

describe("S3MediaStorageService", () => {
  beforeEach(() => {
    sendMock.mockReset();
    (PutObjectCommand as unknown as jest.Mock).mockClear();
  });

  it("deve enviar PutObjectCommand e retornar path s3://... (public)", async () => {
    jest.spyOn(crypto, "randomUUID").mockReturnValue("uuid-1-uuid-1-uuid-1-uuid-1");

    const svc = new S3MediaStorageService({
      bucket: "my-bucket",
      region: "us-east-1",
      publicBaseUrl: "https://my-bucket.s3.amazonaws.com",
      publicKeyPrefix: "public",
      defaultStorageClass: "STANDARD",
    });

    const buffer = Buffer.from("hello");

    const result = await svc.save({
      filename: "foto.png",
      mimeType: "image/png",
      buffer,
      folder: "/users/10",
      visibility: "public",
    });

    expect(PutObjectCommand).toHaveBeenCalledTimes(1);
    const cmdArg = (PutObjectCommand as unknown as jest.Mock).mock.calls[0][0];

    expect(cmdArg).toEqual(
      expect.objectContaining({
        Bucket: "my-bucket",
        Key: "public/users/10/uuid-1-uuid-1-uuid-1-uuid-1.png",
        Body: buffer,
        ContentType: "image/png",
        CacheControl: "public, max-age=31536000, immutable",
        StorageClass: "STANDARD",
      })
    );

    expect(sendMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual(
      expect.objectContaining({
        path: "s3://my-bucket/public/users/10/uuid-1-uuid-1-uuid-1-uuid-1.png",
        url: "https://my-bucket.s3.amazonaws.com/public/users/10/uuid-1-uuid-1-uuid-1-uuid-1.png",
        size: 5,
        mimeType: "image/png",
      })
    );
  });

  it("não deve setar ACL quando visibility for private", async () => {
    jest.spyOn(crypto, "randomUUID").mockReturnValue("uuid-2-uuid-2-uuid-2-uuid-2");

    const svc = new S3MediaStorageService({
      bucket: "my-bucket",
      region: "us-east-1",
      publicBaseUrl: "https://my-bucket.s3.amazonaws.com",
      publicKeyPrefix: "public",
      defaultStorageClass: "STANDARD",
    });

    await svc.save({
      filename: "x.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("abc"),
      visibility: "private",
    });

    const cmdArg = (PutObjectCommand as unknown as jest.Mock).mock.calls[0][0];
    expect(cmdArg.ACL).toBeUndefined();
  });
});