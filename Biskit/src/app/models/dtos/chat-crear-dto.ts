export class ChatCrearDto {
  idCliente: number;
  idVeterinario: number;

  constructor(idCliente: number = 0, idVeterinario: number = 0) {
    this.idCliente = idCliente;
    this.idVeterinario = idVeterinario;
  }
}
