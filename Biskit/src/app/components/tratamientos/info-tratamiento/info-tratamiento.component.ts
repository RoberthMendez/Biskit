import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../../models/Pets/pet';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';
import { Vet } from '../../../models/Vets/vet-cl';
import { Client } from '../../../models/Client/client';
import { TratamientoService } from '../../../services/tratamiento.service';
import { PetService } from '../../../services/pet.service';

@Component({
  selector: 'app-info-tratamiento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './info-tratamiento.component.html',
})
export class InfoTratamientoComponent implements OnInit {
  
  tratamiento: Tratamiento | null = null;
  veterinario: Vet | null = null;
  pet: Pet | null = null;
  owner: Client | null = null;
  isClientView = false;
  backLink: (string | number)[] = [];
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute, 
    private tratamientoService: TratamientoService,
    private petService: PetService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    const petIdParam = this.route.snapshot.paramMap.get('petId');
    const tratamientoIdParam = this.route.snapshot.paramMap.get('tratamientoId');
    const clientIdParam = this.route.snapshot.paramMap.get('clientId');

    const petId = petIdParam !== null ? Number(petIdParam) : null;
    const tratamientoId = tratamientoIdParam !== null ? Number(tratamientoIdParam) : null;
    const clientId = clientIdParam !== null ? Number(clientIdParam) : null;

    if (clientId !== null && !Number.isNaN(clientId)) {
      this.backLink = ['/client', clientId, 'pet', String(petId)];
      this.isClientView = true;
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
      if (!this.isClientView) {
        this.backLink = ['/vet/pets', petId];
      }
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
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
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
        this.closeDeleteModal();
        this.router.navigate(['/vet/pets', petId]);
      },
      error: (error) => {
        console.error('Error al eliminar tratamiento:', error);
      },
    });
  }
}

