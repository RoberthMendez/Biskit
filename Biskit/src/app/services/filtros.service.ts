import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FiltrosPetsDto } from '../models/dtos/filtros-pets-dto';
import { Pet } from '../models/Pets/pet';
import { FiltrosVetsDto } from '../models/dtos/filtros-vets-dto';
import { Vet } from '../models/Vets/vet-cl';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {

  constructor(private http: HttpClient) { }

  getPetsFiltrados(filtro: FiltrosPetsDto, misMascotas?: boolean, vetId?: number){

    let params = new HttpParams();

    if (filtro.estado != null)
      params = params.set('estado', filtro.estado.toString());
    if (filtro.especie)
      params = params.set('especie', filtro.especie);
    if (filtro.raza)
      params = params.set('raza', filtro.raza);
    if (filtro.edad != null)
      params = params.set('edad', filtro.edad.toString());
    if (filtro.peso != null)
      params = params.set('peso', filtro.peso.toString());
    if (filtro.enfermedad)
      params = params.set('enfermedad', filtro.enfermedad);
    if (filtro.tratamientos != null)
      params = params.set('tratamientos', filtro.tratamientos.toString());

    // If requesting only "my pets", backend expects misMascotas and vetId
    if (misMascotas === true && vetId != null) {
      params = params.set('misMascotas', 'true');
      params = params.set('vetId', vetId.toString());
      // Call the vets filtering endpoint which supports returning pets for a vet
      return this.http.get<Pet[]>(`http://localhost:8080/filtros/vets`, { params });
    }

    return this.http.get<Pet[]>(`http://localhost:8080/filtros/pets`, { params });

  }

  getVetsFiltrados(filtros: FiltrosVetsDto) {
    
    let params = new HttpParams();

    if (filtros.estado != null)
      params = params.set('estado', filtros.estado.toString());

    if (filtros.especialidad)
      params = params.set('especialidad', filtros.especialidad);

    if (filtros.tratamientos != null)
      params = params.set('tratamientos', filtros.tratamientos.toString());

    if(filtros.pet != null)
      params = params.set('pet', filtros.pet);

    return this.http.get<Vet[]>(`http://localhost:8080/filtros/vets`, { params });
  }


}
