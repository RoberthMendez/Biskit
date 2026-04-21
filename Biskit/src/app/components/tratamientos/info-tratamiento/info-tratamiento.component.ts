import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute, 
    private tratamientoService: TratamientoService,
    private petService: PetService
  ) {}

  ngOnInit(): void {

    const petId = Number(this.route.snapshot.paramMap.get('petId'));
    const tratamientoId = Number(this.route.snapshot.paramMap.get('tratamientoId'));


    if (tratamientoId) {
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

    if(petId) {
      this.petService.findById(petId).subscribe({
        next: (pet) => {
          this.pet = pet;
          this.owner = pet.owner;
        },
        error: (error) => {
          console.error('Error al cargar mascota:', error);
        }
      });
      this.isClientView = false;
      this.backLink = ['/vet/pets', petId];
      return;
    }

    this.backLink = ['/vet/pets'];

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

    const parsedDate = new Date(this.tratamiento.fecha);
    if (Number.isNaN(parsedDate.getTime())) return 'Sin fecha';

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(parsedDate);
  }

  eliminarTratamiento(): void {
    if (confirm('¿Seguro que deseas eliminar este tratamiento?')) {
      // Lógica para eliminar el tratamiento
    }
  }
}

