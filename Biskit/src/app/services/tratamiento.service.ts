import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tratamiento } from '../models/Tratamiento/tratamiento';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  constructor(
    private http: HttpClient
  ) { }

  findTratamientosPet(petId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`http://localhost:8080/vet/pets/tratamientos/${petId}`);
  }

}
