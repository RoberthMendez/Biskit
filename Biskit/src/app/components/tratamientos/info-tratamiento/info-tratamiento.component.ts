import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { TratamientoService } from '../../../services/tratamiento.service';
import { PetService } from '../../../services/pet.service';
import { DeleteModalComponent } from '../../reusables/delete-modal/delete-modal.component';
import { BackButtonComponent } from '../../reusables/back-button/back-button.component';

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
  tratamiento: Tratamiento | null = null;
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

  constructor(
    private route: ActivatedRoute,
    private tratamientoService: TratamientoService,
    private petService: PetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const petIdParam = this.route.snapshot.paramMap.get('petId');
    const vetIdParam = this.route.snapshot.paramMap.get('vetId');
    const tratamientoIdParam =
      this.route.snapshot.paramMap.get('tratamientoId');
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');

    const petId = petIdParam !== null ? Number(petIdParam) : null;
    const vetId = vetIdParam !== null ? Number(vetIdParam) : null;
    const tratamientoId =
      tratamientoIdParam !== null ? Number(tratamientoIdParam) : null;
    const clientId = clientIdParam !== null ? Number(clientIdParam) : null;
    const isAdminPage = routePath.startsWith('admin/');
    const isAdminVetDetailPage =
      isAdminPage && vetId !== null && !Number.isNaN(vetId);

    this.isClientView = routePath.startsWith('client/');

    if (this.isClientView && clientId !== null && !Number.isNaN(clientId)) {
      this.backLink = `/client/${clientId}/pet/${petId}`;
      this.backLabel = 'Detalle de Mascota';
      this.isClientView = true;
    }

    if (!this.isClientView) {
      const contextParam = isAdminPage ? 'idAdmin' : 'vetId';
      const contextId = Number(this.route.snapshot.paramMap.get(contextParam));
      this.basePath = `/${isAdminPage ? 'admin' : 'vet'}/${contextId}`;
      const hasPetContext = petId !== null && !Number.isNaN(petId);
      const hasVetContext = vetId !== null && !Number.isNaN(vetId);

      if (hasPetContext) {
        this.backLink = `${this.basePath}/pets/${petId}`;
        this.backLabel = 'Detalle de Mascota';
      } else if (isAdminPage && hasVetContext) {
        this.backLink = `${this.basePath}/vets/${vetId}`;
        this.backLabel = 'Detalle del Veterinario';
      } else {
        this.backLink = this.basePath;
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
      } else if (
        isAdminPage &&
        hasVetContext &&
        tratamientoId !== null &&
        !Number.isNaN(tratamientoId)
      ) {
        this.editLink = `${this.basePath}/vets/${vetId}/tratamiento/update/${tratamientoId}`;
      }
    }

    if (tratamientoId !== null && !Number.isNaN(tratamientoId)) {
      this.tratamientoService.findById(tratamientoId).subscribe({
        next: (tratamiento) => {
          this.tratamiento = tratamiento;
          this.veterinario = tratamiento.vet;

          if (petId === null && tratamiento.pet != null) {
            this.pet = this.toPetDto(tratamiento.pet as any);
            this.owner = this.toOwner(tratamiento.pet as any);
          }

          if (
            petId === null &&
            tratamiento.pet?.id != null &&
            !isAdminVetDetailPage
          ) {
            this.editLink = `${this.basePath}/pets/${tratamiento.pet.id}/tratamiento/update/${tratamiento.id}`;
          }

          if (
            isAdminVetDetailPage &&
            tratamientoId !== null &&
            !Number.isNaN(tratamientoId)
          ) {
            this.editLink = `${this.basePath}/vets/${vetId}/tratamiento/update/${tratamiento.id}`;
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

    const rawFecha = this.tratamiento.fecha as Date | string;
    const localDateMatch =
      typeof rawFecha === 'string'
        ? rawFecha.match(/^(\d{4})-(\d{2})-(\d{2})$/)
        : null;

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

  private toPetDto(pet: any): PetDTO {
    const edad =
      typeof pet?.edad === 'number'
        ? pet.edad
        : this.calculateEdadFromFecha(pet?.fechaNacimiento);

    return {
      id: pet?.id,
      nombre: pet?.nombre ?? '',
      estado: pet?.estado ?? true,
      edad,
      peso: pet?.peso ?? 0,
      urlFoto: pet?.urlFoto ?? '',
      enfermedad:
        typeof pet?.enfermedad === 'string'
          ? pet.enfermedad
          : (pet?.enfermedad?.nombre ?? ''),
      owner:
        typeof pet?.owner === 'string' ? pet.owner : (pet?.owner?.nombre ?? ''),
      raza:
        typeof pet?.raza === 'string' ? pet.raza : (pet?.raza?.nombre ?? ''),
      especie:
        typeof pet?.especie === 'string'
          ? pet.especie
          : (pet?.raza?.especie?.nombre ?? pet?.especie?.nombre ?? ''),
    };
  }

  private toOwner(pet: any): Client {
    if (pet?.owner && typeof pet.owner === 'object') {
      return pet.owner;
    }

    if (typeof pet?.owner === 'string') {
      return new Client(undefined, pet.owner);
    }

    return new Client();
  }

  private calculateEdadFromFecha(
    fechaNacimiento: Date | string | null | undefined,
  ): number {
    if (!fechaNacimiento) {
      return 0;
    }

    const birthDate = new Date(fechaNacimiento);
    if (Number.isNaN(birthDate.getTime())) {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  openDeleteModal(): void {
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    const shouldNavigate = this.shouldNavigateAfterDelete;
    const petId = this.pet?.id;

    this.showDeleteModal = false;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;

    if (shouldNavigate && petId != null) {
      this.router.navigateByUrl(this.backLink);
    }
  }

  confirmDeleteTratamiento(): void {
    const tratamientoId = this.tratamiento?.id;
    const petId = this.pet?.id;

    if (tratamientoId == null || petId == null) {
      this.closeDeleteModal();
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
}
