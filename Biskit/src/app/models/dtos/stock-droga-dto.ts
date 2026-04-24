export class StockDrogaDto {
    drogaNombre: string;
    stockActual: number;

    constructor(drogaNombre: string, stockActual: number) {
        this.drogaNombre = drogaNombre;
        this.stockActual = stockActual;
    }
}
