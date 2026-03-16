// src/modules/events/domain/entities/event.entity.ts
import { EventCategory } from "../value-objects/event-category";

export interface EventProps {
  id: number;
  titulo: string;
  cat: EventCategory;
  data: string; // manter string por enquanto (YYYY-MM-DD). Depois podemos evoluir para Date VO
  hora: string; // "HH:mm"
  local: string;
  preco: string; // manter string por enquanto
  img: string; // url/path
  desc: string;
  cityId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EventEntity {
  constructor(public readonly props: EventProps) {}

  get id() {
    return this.props.id;
  }
  get titulo() {
    return this.props.titulo;
  }
  get cat() {
    return this.props.cat;
  }
  get data() {
    return this.props.data;
  }
  get hora() {
    return this.props.hora;
  }
  get local() {
    return this.props.local;
  }
  get preco() {
    return this.props.preco;
  }
  get img() {
    return this.props.img;
  }
  get desc() {
    return this.props.desc;
  }
  get cityId() {
    return this.props.cityId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
}
