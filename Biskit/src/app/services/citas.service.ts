import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CitaDto } from '../models/dtos/cita-dto';
import { TipoCita } from '../models/Citas/tipo-cita';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  constructor(private http: HttpClient) {}

  crearCita(citaDto: CitaDto, numSemana: number) {
    return this.http.post('http://localhost:8080/citas/add', citaDto, {
      params: { numSemana },
    });
  }

  getTiposCita() {
    return this.http.get<TipoCita[]>('http://localhost:8080/citas/tipos');
  }

  editarCita(id: number, citaDto: CitaDto, numSemana: number) {
    return this.http.put(`http://localhost:8080/citas/update/${id}`, citaDto, {
      params: { numSemana },
    });
  }

  eliminarCita(id: number) {
    return this.http.delete(`http://localhost:8080/citas/delete/${id}`);
  }
}
