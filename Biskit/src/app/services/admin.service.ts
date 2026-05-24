import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DrogaTratamientosCountDto } from '../models/dtos/droga-tratamientos-count-dto';
import { TratamientoMesDto } from '../models/dtos/tratamiento-mes-dto';
import { TopDto } from '../models/dtos/top-dto';
import { StockDrogaDto } from '../models/dtos/stock-droga-dto';
import { Admin } from '../models/Admin/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAdminById(id: string): Observable<any> {
    return this.http.get(`https://biskitserver.onrender.com/admin/${id}`);
  }

  getLastTreatmentCount(): Observable<TratamientoMesDto[]> {
    return this.http.get<TratamientoMesDto[]>('https://biskitserver.onrender.com/admin/ultimos-tratamientos-count');
  }

  getNumTratamientosPorDrogaUltimoMes(): Observable<DrogaTratamientosCountDto[]> {
    return this.http.get<DrogaTratamientosCountDto[]>('https://biskitserver.onrender.com/admin/droga-tratamientos-mes-count');
  }

  getNumVeterinarios(): Observable<number> {
    return this.http.get<number>('https://biskitserver.onrender.com/admin/vets-count');
  }

  getNumVeterinariosActivos(): Observable<number> {
    return this.http.get<number>('https://biskitserver.onrender.com/admin/vets-activos-count');
  }

  getNumVeterinariosInactivos(): Observable<number> {
    return this.http.get<number>('https://biskitserver.onrender.com/admin/vets-inactivos-count');
  }

  getVentasTotales(): Observable<number> {
    return this.http.get<number>('https://biskitserver.onrender.com/admin/ventas-totales');
  }

  getGananciasTotales(): Observable<number> {
    return this.http.get<number>('https://biskitserver.onrender.com/admin/ganancias-totales');
  }

  getTop5Drogas(): Observable<TopDto[]>{
    return this.http.get<TopDto[]>('https://biskitserver.onrender.com/admin/top5-drogas');
  }

  getTop5Enfermedades(): Observable<TopDto[]>{
    return this.http.get<TopDto[]>('https://biskitserver.onrender.com/admin/top5-enfermedades');
  }

  getDrogasBajasEnStock(): Observable<StockDrogaDto[]> {
    return this.http.get<StockDrogaDto[]>('https://biskitserver.onrender.com/admin/drogas-bajas-stock');
  }

  descargarReporteExcel(): void {
    this.http.get('https://biskitserver.onrender.com/admin/reporte-ultimo-mes-excel', {
        responseType: 'blob'  // ðŸ‘ˆ indica que la respuesta es un archivo binario
    }).subscribe({
        next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-biskit-${new Date().toLocaleDateString('es-CO')}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
        },
        error: (err) => {
            console.error('Error al descargar el reporte:', err);
        }
    });
  }

  //Verificar existencia de Admin por ID
  existsById(id: number): Observable<void> {
    return this.http.get<void>(`https://biskitserver.onrender.com/admin/${id}/exists`);
  }

  getDetails(): Observable<Admin> {
      return this.http.get<Admin>(`https://biskitserver.onrender.com/admin/details`);
  }
}

