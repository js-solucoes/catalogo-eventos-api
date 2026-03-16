export interface TouristPointProps {
  id?: number;
  nome: string;
  tipo: string;
  horario: string;
  img: string;
  desc: string;
  cityId: number;
}

export class TouristPointEntity {
    private props: TouristPointProps
    constructor(props: TouristPointProps) {
        this.props = props
    }

    get id() {
        return this.props.id
    }

    get nome() {
        return this.props.nome
    }

    get tipo() {
        return this.props.tipo
    }

    get horario() {
        return this.props.horario
    }

    get img() {
        return this.props.img
    }

    get desc() {
        return this.props.desc
    }

    get cityId() {
        return this.props.cityId
    }

    toJSON() {
        return {
            id: this.props.id,
            nome: this.props.nome,
            tipo: this.props.tipo,
            
        }
    }
}
