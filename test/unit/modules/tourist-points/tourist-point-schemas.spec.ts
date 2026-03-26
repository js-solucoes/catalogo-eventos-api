import {
  createTouristPointSchema,
  updateTouristPointSchema,
} from "@/modules/tourist-points/presentation/http/validators/tourist-point-schemas";

const validCreate = {
  cityId: 1,
  citySlug: "campo-grande",
  name: "Parque",
  description: "Um parque na cidade",
  category: "parque" as const,
  address: "Rua A",
  openingHours: "09:00",
  imageUrl: "https://example.com/p.jpg",
  featured: true,
  published: true,
};

describe("tourist-point-schemas", () => {
  it("createTouristPointSchema aceita payload válido", () => {
    expect(createTouristPointSchema.safeParse(validCreate).success).toBe(true);
  });

  it("createTouristPointSchema rejeita nome curto e horário inválido", () => {
    expect(
      createTouristPointSchema.safeParse({ ...validCreate, name: "ab" })
        .success,
    ).toBe(false);
    expect(
      createTouristPointSchema.safeParse({ ...validCreate, openingHours: "25:00" })
        .success,
    ).toBe(false);
    expect(
      createTouristPointSchema.safeParse({ ...validCreate, category: "x" })
        .success,
    ).toBe(false);
  });

  it("updateTouristPointSchema aceita vazio e parcial", () => {
    expect(updateTouristPointSchema.safeParse({}).success).toBe(true);
    expect(
      updateTouristPointSchema.safeParse({ name: "Novo nome" }).success,
    ).toBe(true);
  });
});
