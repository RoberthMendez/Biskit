import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DrogaTratamientosCountDto } from '../../../models/dtos/droga-tratamientos-count-dto';
import { TratamientoMesDto } from '../../../models/dtos/tratamiento-mes-dto';
import { TopDto } from '../../../models/dtos/top-dto';
import { StockDrogaDto } from '../../../models/dtos/stock-droga-dto';
import { Admin } from '../../../models/Admin/admin';
import { Router, ActivatedRoute } from '@angular/router';
import { CardKPIComponent } from './card-kpi/card-kpi.component';
import { CardDonaComponent } from './card-dona/card-dona.component';
import { CardBarrasComponent } from './card-barras/card-barras.component';
import { CardTop5Component } from './card-top5/card-top5.component';
import { CardTablaComponent } from './card-tabla/card-tabla.component';
import { CardRepuestosComponent } from './card-repuestos/card-repuestos.component';
import { FiltrosEstadoService } from '../../../services/filtros-estado.service';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardKPIComponent,
    CardDonaComponent,
    CardBarrasComponent,
    CardTop5Component,
    CardTablaComponent,
    CardRepuestosComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  public adminId: string = '';
  public ventasTotales: number = 0;
  public gananciasTotales: number = 0;
  public numMascotas: number = 0;
  public numMascotasActivas: number = 0;
  public numMascotasInactivas: number = 0;
  public numVeterinarios: number = 0;
  public numVeterinariosActivos: number = 0;
  public numVeterinariosInactivos: number = 0;
  public tratamientosMes: TratamientoMesDto[] = [];
  public top5Drogas: TopDto[] = [];
  public top5Enfermedades: TopDto[] = [];
  public drogaTratamientosMesCount: DrogaTratamientosCountDto[] = [];
  public drogasBajasEnStock: StockDrogaDto[] = [];
  public admin: Admin = new Admin();

  constructor(
    private adminService: AdminService,
    private petService: PetService,
    private route: ActivatedRoute,
    private router: Router,
    private filtrosEstadoService: FiltrosEstadoService,
  ) {}

  ngOnInit() {
    this.filtrosEstadoService.limpiarTodo();
    
    this.adminService.getDetails().subscribe({
      next: (admin) => {
        this.admin = admin;
      },
    });

    this.adminService.getLastTreatmentCount().subscribe({
      next: (tratamientosMes) => {
        this.tratamientosMes = tratamientosMes;
      },
    });

    this.adminService.getNumTratamientosPorDrogaUltimoMes().subscribe({
      next: (data) => {
        this.drogaTratamientosMesCount = [...data].sort(
          (a, b) => b.count - a.count,
        );
      },
    });

    this.adminService.getNumVeterinarios().subscribe({
      next: (count) => {
        this.numVeterinarios = count;
      },
    });

    this.adminService.getNumVeterinariosActivos().subscribe({
      next: (count) => {
        this.numVeterinariosActivos = count;
      },
    });

    this.adminService.getNumVeterinariosInactivos().subscribe({
      next: (count) => {
        this.numVeterinariosInactivos = count;
      },
    });

    this.adminService.getNumVeterinariosActivos().subscribe({
      next: (count) => {
        this.numVeterinariosActivos = count;
      },
    });

    this.petService.countPets().subscribe({
      next: (count) => {
        this.numMascotas = count;
      },
    });

    this.petService.countPetsActivos().subscribe({
      next: (count) => {
        this.numMascotasActivas = count;
      },
    });

    this.petService.countPetsInactivos().subscribe({
      next: (count) => {
        this.numMascotasInactivas = count;
      },
    });

    this.adminService.getVentasTotales().subscribe({
      next: (ventas) => {
        this.ventasTotales = ventas;
      },
    });

    this.adminService.getGananciasTotales().subscribe({
      next: (ganancias) => {
        this.gananciasTotales = ganancias;
      },
    });

    this.adminService.getTop5Drogas().subscribe({
      next: (topDrogas) => {
        this.top5Drogas = topDrogas;
      },
    });

    this.adminService.getTop5Enfermedades().subscribe({
      next: (topEnfermedades) => {
        this.top5Enfermedades = topEnfermedades;
      },
    });

    this.adminService.getDrogasBajasEnStock().subscribe({
      next: (drogasBajasStock) => {
        this.drogasBajasEnStock = drogasBajasStock;
      },
    });
  }

  public descargarReporteUltimoMes() {
    this.adminService.descargarReporteExcel();
  }

  public descargarReporteGeneral() {
    this.adminService.descargarReporteExcel();
  }
}
