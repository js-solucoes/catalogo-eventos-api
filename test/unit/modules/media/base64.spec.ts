import { normalizeToArray, parseBase64 } from "@/modules/media/application/helpers/base64";

describe("parseBase64", () => {
  const small = Buffer.from("hi").toString("base64");

  it("parseia data URL e retorna buffer + hash", () => {
    const input = `data:image/png;base64,${small}`;
    const out = parseBase64(input);
    expect(out.buffer.length).toBeGreaterThan(0);
    expect(out.contentType).toBe("image/png");
    expect(out.hash).toMatch(/^[a-f0-9]{40}$/);
  });

  it("aceita raw base64 sem prefixo", () => {
    const out = parseBase64(small);
    expect(out.contentType).toBeUndefined();
    expect(out.buffer.equals(Buffer.from("hi"))).toBe(true);
  });

  it("rejeita payload inválido", () => {
    expect(() => parseBase64("not!!!base64")).toThrow("Invalid base64");
  });
});

describe("normalizeToArray", () => {
  it("envolve valor único em array", () => {
    expect(normalizeToArray(1)).toEqual([1]);
    expect(normalizeToArray([2, 3])).toEqual([2, 3]);
  });
});
