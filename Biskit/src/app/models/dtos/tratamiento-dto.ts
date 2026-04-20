export class TratamientoDto {
	id?: number;
	fecha: string;
	petId: number;
	vetId: number;
	drogasIds: number[];

	constructor(
		id?: number,
		fecha: string = '',
		petId: number = 0,
		vetId: number = 0,
		drogasIds: number[] = [],
	) {
		this.id = id;
		this.fecha = fecha;
		this.petId = petId;
		this.vetId = vetId;
		this.drogasIds = drogasIds;
	}
}
