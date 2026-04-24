export class TopDrogaDto {
    top: number;
    drogaNombre: string;
    countTratamientos: number;

    constructor(top: number, drogaNombre: string, countTratamientos: number) {
        this.top = top;
        this.drogaNombre = drogaNombre;
        this.countTratamientos = countTratamientos;
    }
}
