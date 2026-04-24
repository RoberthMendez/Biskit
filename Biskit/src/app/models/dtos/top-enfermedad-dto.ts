export class TopEnfermedadDto {
    top: number;
    enfermedadNombre: string;
    countPets: number;

    constructor(top: number, enfermedadNombre: string, countPets: number) {
        this.top = top;
        this.enfermedadNombre = enfermedadNombre;
        this.countPets = countPets;
    }
}
