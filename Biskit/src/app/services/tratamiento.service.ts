import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TratamientoCl } from '../models/Tratamiento/tratamiento-cl';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TratamientoService {

  constructor(
    private http: HttpClient
  ) { }

  findTratamientosPet(petId: number): Observable<TratamientoCl[]> {
    return this.http.get<TratamientoCl[]>(`http://localhost:8080/vet/pets/tratamientos/${petId}`);
  }

}
