import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CitaDto } from '../models/dtos/cita-dto';
import { TipoCita } from '../models/Citas/tipo-cita';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  constructor(private http: HttpClient) {}

  crearCita(citaDto: CitaDto, numSemana: number) {
    return this.http.post(`${environment.apiUrl}/citas/add`, citaDto, {
      params: { numSemana },
    });
  }

  getTiposCita() {
    return this.http.get<TipoCita[]>(`${environment.apiUrl}/citas/tipos`);
  }

  editarCita(id: number, citaDto: CitaDto, numSemana: number) {
    return this.http.put(`${environment.apiUrl}/citas/update/${id}`, citaDto, {
      params: { numSemana },
    });
  }

  eliminarCita(id: number) {
    return this.http.delete(`${environment.apiUrl}/citas/delete/${id}`);
  }
}
