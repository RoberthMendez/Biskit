export class TopDto {

    top: number;
    nombre: string;
    count: number;

    constructor(top: number, nombre: string, count: number) {
        this.top = top;
        this.nombre = nombre;
        this.count = count;
    }
}
