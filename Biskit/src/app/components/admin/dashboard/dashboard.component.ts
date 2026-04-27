import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DrogaTratamientosCountDto } from '../../../models/dtos/droga-tratamientos-count-dto';
import { TratamientoMesDto } from '../../../models/dtos/tratamiento-mes-dto';
import { TopDto } from '../../../models/dtos/top-dto';
import { StockDrogaDto } from '../../../models/dtos/stock-droga-dto';
import { Admin } from '../../../models/Admin/admin';
import { ActivatedRoute } from '@angular/router';
import { CardKPIComponent } from "./card-kpi/card-kpi.component";
import { CardDonaComponent } from "./card-dona/card-dona.component";
import { CardBarrasComponent } from "./card-barras/card-barras.component";
import { CardTop5Component } from "./card-top5/card-top5.component";
import { CardTablaComponent } from "./card-tabla/card-tabla.component";
import { CardRepuestosComponent } from "./card-repuestos/card-repuestos.component";
import { NavbarComponent, type NavbarOption } from '../../reusables/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardKPIComponent, CardDonaComponent, CardBarrasComponent, CardTop5Component, CardTablaComponent, CardRepuestosComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

  public adminId: string = '';
  public get dashboardNavbarOptions(): NavbarOption[] {
    if (!this.adminId) {
      return [];
    }

    return [
      { label: 'Mascotas', route: ['/admin', this.adminId, 'pets'] },
      { label: 'Veterinarios', route: ['/admin', this.adminId, 'vets'] },
      { label: 'Clientes', route: ['/admin', this.adminId, 'clients'] },
    ];
  }

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    const adminId = this.route.snapshot.paramMap.get('id');
    this.adminId = adminId ?? '';
    if (adminId)
      this.adminService.getAdminById(adminId).subscribe({
        next: (admin) => {
          this.admin = admin;
        }
      });
    else
      console.error('No se pudo obtener el ID del administrador desde la ruta.');

    this.adminService.getLastTreatmentCount().subscribe({
      next: (tratamientosMes) => {
        this.tratamientosMes = tratamientosMes;
      }
    });

    this.adminService.getNumTratamientosPorDrogaUltimoMes().subscribe(
      {
        next: (data) => {
          this.drogaTratamientosMesCount = [...data].sort((a, b) => b.count - a.count);
        
        }
      }
    );

    this.adminService.getNumVeterinarios().subscribe(
      {
        next: (count) => {
          this.numVeterinarios = count;
        }
      }
    );

    this.adminService.getNumVeterinariosActivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosActivos = count;
        }
      }
    );

    this.adminService.getNumVeterinariosInactivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosInactivos = count;
        }
      }
    );

    this.adminService.getNumVeterinariosActivos().subscribe(
      {
        next: (count) => {
          this.numVeterinariosActivos = count;
        }
      }
    );

    this.adminService.getNumMascotas().subscribe(
      {
        next: (count) => {
          this.numMascotas = count;
        }
      }
    );

    this.adminService.getNumMascotasActivas().subscribe(
      {
        next: (count) => {
          this.numMascotasActivas = count;
        }
      }
    );

    this.adminService.getNumMascotasInactivas().subscribe(
      {
        next: (count) => {
          this.numMascotasInactivas = count;
        }
      }
    );

    this.adminService.getVentasTotales().subscribe(
      {
        next: (ventas) => {
          this.ventasTotales = ventas;
        }
      }
    );

    this.adminService.getGananciasTotales().subscribe(
      {
        next: (ganancias) => {
          this.gananciasTotales = ganancias;
        }
      }
    );
    
    this.adminService.getTop5Drogas().subscribe(
      {
        next: (topDrogas) => {
          this.top5Drogas = topDrogas;
        }
      }
    );

    this.adminService.getTop5Enfermedades().subscribe(
      {
        next: (topEnfermedades) => {
          this.top5Enfermedades = topEnfermedades;
        }
      }
    );

    this.adminService.getDrogasBajasEnStock().subscribe(
      {
        next: (drogasBajasStock) => {
          this.drogasBajasEnStock = drogasBajasStock;
        }
      }
    );
  }
}


