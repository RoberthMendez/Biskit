export class DrogaTratamientosCountDto {
    drogaNombre: string;
    count: number;

    constructor(drogaNombre: string, count: number) {
        this.drogaNombre = drogaNombre;
        this.count = count;
    }
}
