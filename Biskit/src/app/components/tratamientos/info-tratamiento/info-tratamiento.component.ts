import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { TratamientoService } from '../../../services/tratamiento.service';
import { PetService } from '../../../services/pet.service';
import { DeleteModalComponent } from '../../reusables/delete-modal/delete-modal.component';
import { BackButtonComponent } from '../../reusables/back-button/back-button.component';
import { TratamientoDetalleDto } from '../../../models/dtos/tratamiento-detalle-dto';

@Component({
  selector: 'app-info-tratamiento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DeleteModalComponent,
    BackButtonComponent,
  ],
  templateUrl: './info-tratamiento.component.html',
})
export class InfoTratamientoComponent implements OnInit {
  tratamiento: TratamientoDetalleDto | null = null;
  veterinario: Vet | null = null;
  pet: PetDTO | null = null;
  owner: Client | null = null;
  isClientView = false;
  basePath = '';
  backLink = '';
  backLabel = 'Volver';
  editLink = '';
  showDeleteModal = false;
  deleteSuccessMessage = '';
  shouldNavigateAfterDelete = false;
  private routeTratamientoId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private tratamientoService: TratamientoService,
    private petService: PetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const petIdParam = this.route.snapshot.paramMap.get('petId');
    const tratamientoIdParam =
      this.route.snapshot.paramMap.get('tratamientoId');
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');

    const petId = petIdParam !== null ? Number(petIdParam) : null;
    const tratamientoId =
      tratamientoIdParam !== null ? Number(tratamientoIdParam) : null;
    this.routeTratamientoId =
      tratamientoId !== null && !Number.isNaN(tratamientoId)
        ? tratamientoId
        : null;
    const clientId = clientIdParam !== null ? Number(clientIdParam) : null;
    const isAdminPage = routePath.startsWith('admin/');

    this.isClientView = routePath.startsWith('client/');

    if (this.isClientView) {
      this.backLink = `/client/pet/${petId}`;
      this.backLabel = 'Detalle de Mascota';
      this.isClientView = true;
    }

    if (!this.isClientView) {
      this.basePath = `/${isAdminPage ? 'admin' : 'vet'}`;
      const hasPetContext = petId !== null && !Number.isNaN(petId);

      if (hasPetContext) {
        this.backLink = `${this.basePath}/pets/${petId}`;
        this.backLabel = 'Detalle de Mascota';
      } else {
        this.backLink = isAdminPage ? '/admin' : '/vet';
        this.backLabel = isAdminPage
          ? 'Panel de Administrador'
          : 'Panel Veterinario';
      }

      if (
        hasPetContext &&
        tratamientoId !== null &&
        !Number.isNaN(tratamientoId)
      ) {
        this.editLink = `${this.basePath}/pets/${petId}/tratamiento/update/${tratamientoId}`;
      }
    }

    if (tratamientoId !== null && !Number.isNaN(tratamientoId)) {
      this.tratamientoService.findById(tratamientoId).subscribe({
        next: (tratamiento) => {
          tratamiento.id =
            this.resolveTratamientoId(tratamiento) ?? tratamientoId;
          this.tratamiento = tratamiento;
          this.veterinario = tratamiento.vet;
          this.owner = tratamiento.client;

          if (tratamiento.pet != null) {
            this.pet = tratamiento.pet;
          }

          if (petId === null && tratamiento.pet?.id != null && !isAdminPage) {
            this.editLink = `${this.basePath}/pets/${tratamiento.pet.id}/tratamiento/update/${tratamiento.id}`;
          }
        },
        error: (error) => {
          console.error('Error al cargar tratamiento:', error);
        },
      });
    }

    if (petId !== null && !Number.isNaN(petId)) {
      this.petService.findById(petId).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.petService.getPetOwner(petId).subscribe({
            next: (owner) => {
              this.owner = owner;
            },
            error: () => {
              this.owner = new Client();
            },
          });
        },
        error: (error) => {
          console.error('Error al cargar mascota:', error);
        },
      });
      return;
    }
  }

  getEdad(): string {
    return this.pet?.edad != null ? this.pet.edad.toString() : 'N/A';
  }

  getFechaTratamiento(): string {
    if (!this.tratamiento?.fecha) return 'Sin fecha';

    const rawFecha = this.tratamiento.fecha;
    const localDateMatch = rawFecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    const parsedDate = localDateMatch
      ? new Date(
          Number(localDateMatch[1]),
          Number(localDateMatch[2]) - 1,
          Number(localDateMatch[3]),
        )
      : new Date(rawFecha);

    if (Number.isNaN(parsedDate.getTime())) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(parsedDate);
  }

  openDeleteModal(): void {
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    const shouldNavigate = this.shouldNavigateAfterDelete;

    this.showDeleteModal = false;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;

    if (shouldNavigate) {
      this.router.navigateByUrl(this.backLink);
    }
  }

  confirmDeleteTratamiento(): void {
    const tratamientoId = this.resolveTratamientoId(this.tratamiento);

    if (tratamientoId == null) {
      console.error(
        'No fue posible resolver el ID del tratamiento a eliminar.',
      );
      return;
    }

    this.tratamientoService.deleteTratamiento(tratamientoId).subscribe({
      next: () => {
        this.shouldNavigateAfterDelete = true;
        this.deleteSuccessMessage = 'Tratamiento eliminado correctamente';
      },
      error: (error) => {
        console.error('Error al eliminar tratamiento:', error);
      },
    });
  }

  private resolveTratamientoId(
    tratamiento: TratamientoDetalleDto | null,
  ): number | null {
    const rawTratamiento = tratamiento as
      | (TratamientoDetalleDto & {
          tratamientoId?: number;
          idTratamiento?: number;
        })
      | null;

    return (
      rawTratamiento?.id ??
      rawTratamiento?.tratamientoId ??
      rawTratamiento?.idTratamiento ??
      this.routeTratamientoId
    );
  }
}
