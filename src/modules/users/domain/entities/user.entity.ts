import { UserRole, UserRoleEnumLiteral } from "../value-objects/user-role";

export interface UserProps {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
}

export class UserEntity {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  get nome() {
    return this.props.nome;
  }

  get email() {
    return this.props.email;
  }

  get senha() {
    return this.props.senha;
  }

  get role() {
    return this.props.role;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      email: this.email,
      role: this.role,
    };
  }
}
