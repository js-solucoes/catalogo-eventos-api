import { QuerySpecification } from "../../domain/specifications/query-specification";
import { eq, like, between } from "../../domain/specifications/factories";

type Params = {
  nome?: string;
  cidade?: string;
  estado?: string;
  ativo?: boolean;
  precoMin?: number;
  precoMax?: number;
};

export class TouristPointSpecificationBuilder {
  private specs: QuerySpecification[] = [];

  withNome(nome?: string) {
    if (nome) this.specs.push(like("nome", nome));
    return this;
  }

  withCidade(cidade?: string) {
    if (cidade) this.specs.push(eq("cidade", cidade));
    return this;
  }

  withEstado(estado?: string) {
    if (estado) this.specs.push(eq("estado", estado));
    return this;
  }

  withAtivo(ativo?: boolean) {
    if (ativo !== undefined) this.specs.push(eq("ativo", ativo));
    return this;
  }

  withPrecoRange(min?: number, max?: number) {
    if (min !== undefined && max !== undefined) {
      this.specs.push(between("preco", min, max));
    }
    return this;
  }

  build(): QuerySpecification | null {
    if (this.specs.length === 0) return null;

    return this.specs.reduce((acc, spec) => acc.and(spec));
  }
}