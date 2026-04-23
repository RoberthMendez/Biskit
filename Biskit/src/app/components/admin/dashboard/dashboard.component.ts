import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Droga } from '../../../models/Droga/droga';
import { DrogasService } from '../../../services/drogas.service';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  public numTratamientos: number = 0;
  public drogas: Droga[] = [];
  public tratamientosPorMedicamento: { drug: Droga, count: number }[] = [];
  public numVeterinariosActivos: number = 0; // Agregado para el número de veterinarios activos
  public numVeterinariosInactivos: number = 0; // Agregado para el número de veterinarios inactivos

  constructor(
    private adminService: AdminService,
    private drogasService: DrogasService
  ) { }
  // Agrega un método para registrar el estado actual del dashboard BORRAR DESPUÉS
  private logDashboardState(): void {
    console.log('Dashboard atributos:', {
      numTratamientos: this.numTratamientos,
      drogas: this.drogas,
      tratamientosPorMedicamento: this.tratamientosPorMedicamento,
      numVeterinariosActivos: this.numVeterinariosActivos,
      numVeterinariosInactivos: this.numVeterinariosInactivos
    });
  }

  ngOnInit() {
    // Llama al método para registrar el estado inicial del dashboard BORRAR DESPUÉS
    this.logDashboardState();

    this.adminService.getLastTreatmentCount().subscribe(count => {
      this.numTratamientos = count;
      // Llama al método para registrar el estado después de obtener el conteo de tratamientos BORRAR DESPUÉS
      this.logDashboardState();
    });

    this.drogasService.findAll().pipe(
      switchMap((drogas) => {
        this.drogas = drogas;

        const countRequests = drogas.map((droga) => {
          if (droga.id == null) {
            return of({ drug: droga, count: 0 });
          }

          return this.adminService.getTreatmentsDrugCount(droga.id).pipe(
            map((count) => ({ drug: droga, count })),
            catchError(() => of({ drug: droga, count: 0 })) 
          );
        });

        return countRequests.length ? forkJoin(countRequests) : of([]);
      })
    ).subscribe({
      next: (tratamientosPorMedicamento) => {
        this.tratamientosPorMedicamento = tratamientosPorMedicamento;
        // Llama al método para registrar el estado después de obtener los conteos por medicamento BORRAR DESPUÉS
        this.logDashboardState();
      }
    });

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

  }
}
