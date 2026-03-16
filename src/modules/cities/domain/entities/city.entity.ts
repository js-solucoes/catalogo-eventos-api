export interface CityProps {
  id?: number;
  nome: string;
  uf: string;
  desc: string;
}

export class CityEntity {
  private props: CityProps;

  constructor(props: CityProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get nome() {
    return this.props.nome;
  }

  get uf() {
    return this.props.uf;
  }

  get desc() {
    return this.props.desc;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      uf: this.uf,
      desc: this.desc,
    };
  }
}