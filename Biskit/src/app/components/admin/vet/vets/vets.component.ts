import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { Vet } from '../../../../models/Vets/vet-cl';
import { TablaComponent } from '../../../reusables/tabla/tabla.component';
import {
  TablaActionClickEvent,
  TablaColumnaInput,
  TablaFilaClickEvent,
} from '../../../reusables/tabla/tabla.types';
import { DeleteModalComponent } from '../../../reusables/delete-modal/delete-modal.component';
import { HeaderComponent } from './header/header.component';
import { BarraBusquedaComponent } from './barra-busqueda/barra-busqueda.component';
import { BackButtonComponent } from "../../../reusables/back-button/back-button.component";
import { MobileVetCardComponent } from './mobile-vet-card/mobile-vet-card.component';

@Component({
  selector: 'app-vets',
  imports: [TablaComponent, DeleteModalComponent, HeaderComponent, BarraBusquedaComponent, BackButtonComponent, MobileVetCardComponent],
  templateUrl: './vets.component.html',
})
export class VetsComponent {

  public vets: Vet[] = [];
  public vetsFiltrados: Vet[] = [];
  public searchTerm: string = '';
  public adminId = 1;
  public hayFiltrosActivos: boolean = false;

  public showModal = false;
  public selectedDeleteId: number | null = null;
  public deleteSuccessMessage = '';

  public readonly columnasVet: TablaColumnaInput[] = [
    {
      header: 'Foto',
      accessor: (fila) => (fila as Vet).urlFoto,
      type: 'image',
      align: 'center',
      imageAlt: 'Foto del veterinario',
    },
    { header: 'Nombre', key: 'nombre' },
    {
      header: 'Especialidad',
      accessor: (fila) => (fila as Vet).especialidad?.nombre ?? 'Sin especialidad',
    },
    { header: 'Correo', key: 'correo' },
    { header: 'Cedula', key: 'cedula' },
    {
      header: 'Estado',
      accessor: (fila) => String((fila as Vet).estado),
      type: 'badge',
      align: 'center',
      badgeMap: {
        true: {
          label: 'ACTIVO',
          className:
            'rounded-lg bg-[#ebfaf1] px-4 py-3 text-sm font-semibold text-[#2bab60]',
        },
        false: {
          label: 'INACTIVO',
          className:
            'rounded-lg bg-[#ededed] px-4 py-3 text-sm font-semibold text-[#8c8c8c]',
        },
      },
    },
    {
      header: 'Acciones',
      type: 'actions',
      align: 'right',
      actions: [
        {
          id: 'edit',
          label: 'Editar',
          icon: 'edit',
          showLabel: false,
          className:
            'flex items-center justify-center gap-2 rounded-lg border border-[#2B5392] bg-transparent px-3 py-2 text-[#2B5392] transition-colors duration-200 hover:bg-[#2B5392] hover:text-[#FBFAF8] lg:px-4',
        },
        {
          id: 'delete',
          label: 'Eliminar',
          icon: 'delete',
          showLabel: false,
          className:
            'flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#B22222] bg-transparent px-3 py-2 text-[#B22222] transition-colors duration-200 hover:bg-[#B22222] hover:text-[#FBFAF8] lg:px-4',
        },
      ],
    },
  ];

  constructor(
    private vetService: VetService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.comprobarId();
    const idAdmin = Number(this.route.snapshot.paramMap.get('idAdmin'));
    if (!Number.isNaN(idAdmin) && idAdmin > 0) {
      this.adminId = idAdmin;
    }

    this.cargarVets();
  }

  // Capturar filtros emitidos desde el componente header
  onFiltrosAplicados(vetsFiltrados: Vet[]) {
    this.vetsFiltrados = vetsFiltrados;
    this.hayFiltrosActivos = true;
  }

  get filteredVets(): Vet[] {
    // Si hay filtros activos, usar siempre los resultados filtrados, aunque estén vacíos
    if (this.hayFiltrosActivos) {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) return this.vetsFiltrados;
      return this.vetsFiltrados.filter((vet) =>
        vet.nombre.toLowerCase().includes(term) ||
        vet.correo.toLowerCase().includes(term) ||
        vet.cedula.toLowerCase().includes(term),
      );
    }

    // Sino, usar la búsqueda normal
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.vets;
    return this.vets.filter((vet) =>
      vet.nombre.toLowerCase().includes(term) ||
      vet.correo.toLowerCase().includes(term) ||
      vet.cedula.toLowerCase().includes(term),
    );
  }

  public onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim().toLowerCase();
  }

  public onRowClick(event: TablaFilaClickEvent): void {
    const vet = this.extraerVet(event.row);
    if (!vet?.id) {
      return;
    }

    this.router.navigate(['/admin', this.adminId, 'vets', vet.id]);
  }

  public onActionClick(event: TablaActionClickEvent): void {
    const vet = this.extraerVet(event.row);
    if (!vet?.id) {
      return;
    }

    if (event.actionId === 'edit') {
      this.router.navigate(['/admin', this.adminId, 'vets', 'update', vet.id]);
      return;
    }

    if (event.actionId === 'delete') {
      this.openDeleteModal(vet.id);
    }
  }

  public onCardClick(vet: Vet): void {
    if (!vet.id) {
      return;
    }

    this.router.navigate(['/admin', this.adminId, 'vets', vet.id]);
  }

  public onEditCard(vet: Vet): void {
    if (!vet.id) {
      return;
    }

    this.router.navigate(['/admin', this.adminId, 'vets', 'update', vet.id]);
  }

  public onDeleteCard(vet: Vet): void {
    if (!vet.id) {
      return;
    }

    this.openDeleteModal(vet.id);
  }

  public openDeleteModal(vetId: number): void {
    this.selectedDeleteId = vetId;
    this.deleteSuccessMessage = '';
    this.showModal = true;
  }

  public closeModal(): void {
    this.showModal = false;
    this.selectedDeleteId = null;
    this.deleteSuccessMessage = '';
  }

  public confirmDelete(): void {
    if (this.selectedDeleteId == null) {
      this.closeModal();
      return;
    }

    const vetId = this.selectedDeleteId;
    this.vetService.deleteVet(vetId).subscribe({
      next: () => {
        this.vets = this.vets.filter((vet) => vet.id !== vetId);
        this.deleteSuccessMessage = 'Veterinario eliminado correctamente';
      },
      error: () => {
        this.closeModal();
      },
    });
  }

  private cargarVets(): void {
    this.vetService.findAll().subscribe({
      next: (vets) => {
        this.vets = vets;
      },
      error: () => {
        this.vets = [];
      },
    });
  }

  private extraerVet(row: unknown): Vet | null {
    if (!row || typeof row !== 'object') {
      return null;
    }

    return row as Vet;
  }

  private comprobarId(): void {
    const idAdminParam = Number(this.route.snapshot.paramMap.get('idAdmin'));
    if (idAdminParam) {
      this.adminService.existsById(idAdminParam).subscribe({
        next: () => {
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Administrador no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }
  }
}
