import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Raza } from '../../../../modelo/Pets/raza';
import { PetCl } from '../../../../modelo/Pets/Pet/pet-cl';
import { PetService } from '../../../../services/pet.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
})
export class FormularioComponent {
  @Input() petId: number | null = null;

  constructor(private petService: PetService) {}
  formPet: PetCl = new PetCl();
  isEditing: boolean = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingPetId: number | null = null;

  ngOnInit(): void {
    if (this.petId) {
      this.isEditing = true;
      this.formPet = this.petService.findById(this.petId);
    }
  }

  savePet(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.formPet.nombre.trim()) {
      this.errorMessage = 'Nombre requerido';
      return;
    }
    if (!this.formPet.owner.nombre.trim()) {
      this.errorMessage = 'Dueño requerido';
      return;
    }
    if (!this.formPet.raza.especie.nombre.trim()) {
      this.errorMessage = 'Especie requerida';
      return;
    }
    if (!this.formPet.raza.nombre.trim()) {
      this.errorMessage = 'Raza requerida';
      return;
    }
    if (!this.formPet.enfermedad.nombre.trim()) {
      this.errorMessage = 'Enfermedad requerida';
      return;
    }
    if (!this.formPet.fechaNacimiento) {
      this.errorMessage = 'Fecha de nacimiento requerida';
      return;
    }
    if (this.formPet.peso <= 0) {
      this.errorMessage = 'Peso debe ser mayor a 0';
      return;
    }
    console.log('Antes de guardar mascota');
    console.log('Mascotas de formulario:', this.formPet);

    // El input date bindea un string, hay que convertirlo a Date
    this.formPet.fechaNacimiento = new Date(this.formPet.fechaNacimiento);

    console.log('Despues de convertir fecha:');

    this.petService.savePet(this.formPet);
    this.successMessage = 'Mascota guardada correctamente';
    this.formPet = new PetCl(); // Resetea el formulario
  }
}
