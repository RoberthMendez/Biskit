export class Credenciales {
  public id?: number;
  public usuario: string;
  public password: string;

  constructor(
    id?: number,
    usuario: string = '',
    password: string = '',
  ) {
    this.id = id;
    this.usuario = usuario;
    this.password = password;
  }
}
