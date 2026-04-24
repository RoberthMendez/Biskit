import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Droga } from '../../../models/Droga/droga';
import { DrogasService } from '../../../services/drogas.service';
import { catchError, count, forkJoin, map, of, switchMap } from 'rxjs';
import { Enfermedad } from '../../../models/Pets/enfermedad';
import { DrogaTratamientosCountDto } from '../../../models/dtos/droga-tratamientos-count-dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  public numUltimosTratamientos: number = 0;
  public drogaTratamientosMesCount: DrogaTratamientosCountDto[] = [];
  public numVeterinariosActivos: number = 0;
  public numVeterinariosInactivos: number = 0; 
  public numMascotas: number = 0; 
  public numMascotasInactivas: number = 0; 
  public ventasTotales: number = 0;
  public gananciasTotales: number = 0;


  public top5Drogas: { drogaNombre: string, top: number }[] = [];
  public top5Enfermedades: { enfermedadNombre: string, top: number }[] = [];
  public drogasBajasEnStock: Droga[] = [];

  constructor(
    private adminService: AdminService
  ) { }
  // Agrega un método para registrar el estado actual del dashboard BORRAR DESPUÉS
  private logDashboardState(): void {
    console.log('Dashboard atributos:', {
      numUltimosTratamientos: this.numUltimosTratamientos,
      drogaTratamientosMesCount : this.drogaTratamientosMesCount,
      numVeterinariosActivos: this.numVeterinariosActivos,
      numVeterinariosInactivos: this.numVeterinariosInactivos,
      numMascotas: this.numMascotas,
      numMascotasInactivas: this.numMascotasInactivas,
      ventasTotales: this.ventasTotales,
      gananciasTotales: this.gananciasTotales,
      top5Drogas: this.top5Drogas,
      top5Enfermedades: this.top5Enfermedades
    });
  }

  ngOnInit() {
    // Llama al método para registrar el estado inicial del dashboard BORRAR DESPUÉS
    this.logDashboardState();

    this.adminService.getLastTreatmentCount().subscribe(count => {
      this.numUltimosTratamientos = count;
      // Llama al método para registrar el estado después de obtener el conteo de tratamientos BORRAR DESPUÉS
      this.logDashboardState();
    });

    this.adminService.getNumTratamientosPorDrogaUltimoMes().subscribe(
      {
        next: (data) => {
          this.drogaTratamientosMesCount = [...data].sort((a, b) => b.count - a.count);
          this.logDashboardState();
        }
      }
    );

    this.adminService.getNumVeterinariosActivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosActivos = count;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener el conteo de veterinarios activos BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getNumVeterinariosInactivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosInactivos = count;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener el conteo de veterinarios inactivos BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getNumVeterinariosActivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosActivos = count;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener el conteo de veterinarios activos BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getNumMascotas().subscribe(
      {
        next: (count) => {
          this.numMascotas = count;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener el conteo de mascotas BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getNumMascotasInactivas().subscribe(
      {
        next: (count) => {
          this.numMascotasInactivas = count;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener el conteo de mascotas inactivas BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getVentasTotales().subscribe(
      {
        next: (ventas) => {
          this.ventasTotales = ventas;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener las ventas totales BORRAR DESPUÉS
        }
      }
    );

    this.adminService.getGananciasTotales().subscribe(
      {
        next: (ganancias) => {
          this.gananciasTotales = ganancias;
          this.logDashboardState(); // Llama al método para registrar el estado después de obtener las ganancias totales BORRAR DESPUÉS
        }
      }
    );
    

  }
}
