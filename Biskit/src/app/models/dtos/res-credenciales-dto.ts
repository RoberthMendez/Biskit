export class ResCredencialesDto {
    id?: number
    tipo: 'CLIENTE' | 'VETERINARIO' | 'ADMIN' | 'CREDENCIALES_INVALIDAS';

    constructor(
        id?: number,
        tipo: 'CLIENTE' | 'VETERINARIO' | 'ADMIN' | 'CREDENCIALES_INVALIDAS' = 'CREDENCIALES_INVALIDAS',
    ) {
        this.id = id;
        this.tipo = tipo;
    }
}
