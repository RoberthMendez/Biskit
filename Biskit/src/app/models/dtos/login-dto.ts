export class LoginDto {
    token: string;
    rol: string;

    constructor(token: string, rol: string) {
        this.token = token;
        this.rol = rol;
    }
}