import { QuerySpecification } from "../../domain/specifications/query-specification";
import { eq, like, between } from "../../domain/specifications/factories";

type Params = {
  nome?: string;
  city?: string;
  estado?: string;
  ativo?: boolean;
  precoMin?: number;
  precoMax?: number;
};

export class TouristPointSpecificationBuilder {
  private specs: QuerySpecification[] = [];

  withName(name?: string) {
    if (name) this.specs.push(like("name", name));
    return this;
  }

  withCity(city?: string) {
    if (city) this.specs.push(eq("city", city));
    return this;
  }

  withState(state?: string) {
    if (state) this.specs.push(eq("state", state));
    return this;
  }

  withPublished(published?: boolean) {
    if (published !== undefined) this.specs.push(eq("published", published));
    return this;
  }

  // withPrecoRange(min?: number, max?: number) {
  //   if (min !== undefined && max !== undefined) {
  //     this.specs.push(between("preco", min, max));
  //   }
  //   return this;
  // }

  build(): QuerySpecification | null {
    if (this.specs.length === 0) return null;

    return this.specs.reduce((acc, spec) => acc.and(spec));
  }
}