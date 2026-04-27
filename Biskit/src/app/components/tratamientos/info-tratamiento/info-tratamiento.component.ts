import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../../models/Pets/pet';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { TratamientoService } from '../../../services/tratamiento.service';
import { PetService } from '../../../services/pet.service';
import { DeleteModalComponent } from '../../reusables/delete-modal/delete-modal.component';

@Component({
  selector: 'app-info-tratamiento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DeleteModalComponent,
  ],
  templateUrl: './info-tratamiento.component.html',
})
export class InfoTratamientoComponent implements OnInit {
  
  tratamiento: Tratamiento | null = null;
  veterinario: Vet | null = null;
  pet: Pet | null = null;
  owner: Client | null = null;
  isClientView = false;
  basePath = '';
  backLink = '';
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
    const tratamientoIdParam = this.route.snapshot.paramMap.get('tratamientoId');
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');

    const petId = petIdParam !== null ? Number(petIdParam) : null;
    const tratamientoId = tratamientoIdParam !== null ? Number(tratamientoIdParam) : null;
    const clientId = clientIdParam !== null ? Number(clientIdParam) : null;

    this.isClientView = routePath.startsWith('client/');

    if (this.isClientView && clientId !== null && !Number.isNaN(clientId)) {
      this.backLink = `/client/${clientId}/pet/${petId}`;
      this.isClientView = true;
    }

    if (!this.isClientView) {
      const contextParam = routePath.startsWith('admin/') ? 'idAdmin' : 'vetId';
      const contextId = Number(this.route.snapshot.paramMap.get(contextParam));
      this.basePath = `/${routePath.startsWith('admin/') ? 'admin' : 'vet'}/${contextId}`;

      if (petId !== null && !Number.isNaN(petId)) {
        this.backLink = `${this.basePath}/pets/${petId}`;
      }

      if (petId !== null && tratamientoId !== null && !Number.isNaN(tratamientoId)) {
        this.editLink = `${this.basePath}/pets/${petId}/tratamiento/update/${tratamientoId}`;
      }
    }

    if (tratamientoId !== null && !Number.isNaN(tratamientoId)) {
      this.tratamientoService.findById(tratamientoId).subscribe({
        next: (tratamiento) => {
          this.tratamiento = tratamiento;
          this.veterinario = tratamiento.vet;
        },
        error: (error) => {
          console.error('Error al cargar tratamiento:', error);
        }
      });
    }

    if (petId !== null && !Number.isNaN(petId)) {
      this.petService.findById(petId).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.owner = pet.owner;
        },
        error: (error) => {
          console.error('Error al cargar mascota:', error);
        }
      });
      return;
    }

  }

  getEdad(): string {
    if (!this.pet?.fechaNacimiento) return 'N/A';
    const today = new Date();
    const birthDate = new Date(this.pet.fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
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
        this.deleteSuccessMessage =
          'Tratamiento eliminado correctamente';
      },
      error: (error) => {
        console.error('Error al eliminar tratamiento:', error);
      },
    });
  }
}

