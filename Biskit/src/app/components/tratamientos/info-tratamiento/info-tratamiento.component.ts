import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Especie {
  id: number;
  nombre: string;
}

interface Raza {
  id: number;
  nombre: string;
  especie: Especie;
}

interface Pet {
  id: number;
  nombre: string;
  peso: number;
  fechaNacimiento: Date;
  urlFoto: string | null;
  raza: Raza | null;
}

interface Droga {
  id: number;
  nombre: string;
}

interface Tratamiento {
  id: number;
  fecha: Date;
  drogas: Droga[];
}

interface Especialidad {
  id: number;
  nombre: string;
}

interface Veterinario {
  id: number;
  nombre: string;
  urlFoto: string | null;
  especialidad: Especialidad;
}

interface Owner {
  id: number;
  nombre: string;
  celular: string;
}

@Component({
  selector: 'app-info-tratamiento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './info-tratamiento.component.html'
})
export class InfoTratamientoComponent implements OnInit {
  
  pet: Pet | null = null;
  tratamiento: Tratamiento | null = null;
  veterinario: Veterinario | null = null;
  owner: Owner | null = null;
  isClientView = false;
  backLink: (string | number)[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    const clientId = this.route.snapshot.paramMap.get('clientId');
    const petId = this.route.snapshot.paramMap.get('petId');

    if (clientId && petId) {
      this.isClientView = true;
      this.backLink = ['/client', clientId, 'pet', petId];
      return;
    }

    if (petId) {
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

  eliminarTratamiento(): void {
    if (confirm('¿Seguro que deseas eliminar este tratamiento?')) {
      // Lógica para eliminar el tratamiento
    }
  }
}

