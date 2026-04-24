export class TratamientoMesDto {
    mes: string;
    numTratamientos: number;

    constructor(mes: string, count: number) {
        this.mes = mes;
        this.numTratamientos = count;
    }
}
