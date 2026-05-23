import { Injectable } from '@angular/core';
import { Vet } from '../models/Vets/vet-cl';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../models/Pets/pet';
import { HorarioDia } from '../models/Citas/horario-dia';
import { CitaDto } from '../models/dtos/cita-dto';
import { ItemTratamientoDto } from '../models/dtos/item-tratamiento-dto';
import { HorarioDiaDto } from '../models/dtos/horario-dia-dto';

@Injectable({
  providedIn: 'root',
})
export class VetService {
  constructor(private http: HttpClient) {}

  // ----- Crear y Actualizar Veterinario (CREATE/UPDATE) -----
  saveVet(vet: Vet): Observable<Vet> {
    if (vet.id)
      return this.http.put<Vet>(
        `http://localhost:8080/vets/update/${vet.id}`,
        vet,
      );
    else return this.http.post<Vet>('http://localhost:8080/vets/add', vet);
  }

  // ----- Mostrar Todos los Veterinarios (READ) -----
  findAll(): Observable<Vet[]> {
    return this.http.get<Vet[]>('http://localhost:8080/vets');
  }

  // ----- Mostrar Veterinario por ID (READ) -----
  findById(id: number): Observable<Vet> {
    return this.http.get<Vet>(`http://localhost:8080/vets/${id}`);
  }

  // ----- Mostrar Tratamientos por ID de Vet (READ) -----
  findTratamientosByVet(vetId: number): Observable<ItemTratamientoDto[]> {
    return this.http.get<ItemTratamientoDto[]>(
      `http://localhost:8080/vets/${vetId}/tratamientos`,
    );
  }

  // ----- Eliminar Veterinario (DELETE) -----
  deleteVet(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/vets/delete/${id}`);
  }

  // ----- Numero de Tratamientos Realizados por un Veterinario -----
  countTratamientosByVet(vetId: number): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8080/vets/${vetId}/tratamientos/count`,
    );
  }

  //Comprobar si el id de vet existe
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`http://localhost:8080/vets/${id}/exists`);
  }

  getHorarioSemanalByVetId(
    vetId: string | number,
  ): Observable<HorarioDiaDto[]> {
    return this.http.get<HorarioDiaDto[]>(
      `http://localhost:8080/vets/${vetId}/horario-semanal`,
    );
  }

  getCitasSemanalesByVetId(
    vetId: string | number,
    numSemana: number,
  ): Observable<CitaDto[]> {
    return this.http.get<CitaDto[]>(
      `http://localhost:8080/vets/${vetId}/citas-semanales`,
      { params: { numSemana: numSemana.toString() } },
    );
  }

  getCitasSemanalesByVetIdSinMascota(
    vetId: string | number,
    numSemana: number,
  ): Observable<CitaDto[]> {
    return this.http.get<CitaDto[]>(
      `http://localhost:8080/vets/${vetId}/citas-semanales-sin-mascota`,
      { params: { numSemana: numSemana.toString() } },
    );
  }
  getDetails(): Observable<Vet> {
    return this.http.get<Vet>(`http://localhost:8080/vets/details`);
  }
}
