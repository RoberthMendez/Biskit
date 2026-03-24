export class ClientCL {
  id: number;
  nombre: string;

  constructor(client?: Partial<ClientCL>) {
    this.id = client?.id ?? 0;
    this.nombre = client?.nombre ?? '';
  }
}