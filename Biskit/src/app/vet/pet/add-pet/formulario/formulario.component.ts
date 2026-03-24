import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../../modelo/Client/client';
import { Enfermedad } from '../../../../modelo/Pets/enfermedad';
import { Especie } from '../../../../modelo/Pets/especie';
import { Raza } from '../../../../modelo/Pets/raza';
import { PetCl } from '../../../../modelo/Pets/Pet/pet-cl';
import { PetService } from '../../../../services/pet.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;

  formData = {
    nombre: '',
    ownerNombre: '',
    especie: '',
    razaNombre: '',
    enfermedadNombre: '',
    fechaNacimiento: '',
    urlFoto: '',
    peso: 0,
  };

  constructor(private readonly petService: PetService) {}

  onSubmit() {
    const v = this.formData;
    this.errorMessage = null;
    this.successMessage = null;

    if (!v.nombre.trim()) {
      this.errorMessage = 'Nombre requerido';
      return;
    }
    if (!v.ownerNombre.trim()) {
      this.errorMessage = 'Dueño requerido';
      return;
    }
    if (!v.especie.trim()) {
      this.errorMessage = 'Especie requerida';
      return;
    }
    if (!v.razaNombre.trim()) {
      this.errorMessage = 'Raza requerida';
      return;
    }
    if (!v.enfermedadNombre.trim()) {
      this.errorMessage = 'Enfermedad requerida';
      return;
    }
    if (!v.fechaNacimiento) {
      this.errorMessage = 'Fecha de nacimiento requerida';
      return;
    }
    if (v.peso <= 0) {
      this.errorMessage = 'Peso debe ser mayor a 0';
      return;
    }

    const generatedId = Date.now();

    const owner: Client = {
      id: generatedId,
      nombre: v.ownerNombre.trim(),
    };

    const especie: Especie = {
      id: generatedId,
      nombre: v.especie.trim(),
    };

    const raza: Raza = {
      id: generatedId,
      nombre: v.razaNombre.trim(),
      especie,
    };

    const enfermedad: Enfermedad = {
      id: generatedId,
      nombre: v.enfermedadNombre.trim(),
    };

    const pet = new PetCl(
      undefined,
      v.nombre.trim(),
      true,
      new Date(v.fechaNacimiento),
      Number(v.peso),
      v.urlFoto.trim(),
      enfermedad,
      owner,
      raza,
      [],
    );

    this.petService.addPet(pet);

    this.successMessage = 'Mascota registrada correctamente';

    this.formData = {
      nombre: '',
      ownerNombre: '',
      especie: '',
      razaNombre: '',
      enfermedadNombre: '',
      fechaNacimiento: '',
      urlFoto: '',
      peso: 0,
    };

    console.log('Mascota registrada:', pet);
  }
}
