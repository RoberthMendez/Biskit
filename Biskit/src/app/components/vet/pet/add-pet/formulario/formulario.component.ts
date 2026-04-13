import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Raza } from '../../../../../models/Pets/raza';
import { Pet } from '../../../../../models/Pets/pet';
import { PetService } from '../../../../../services/pet.service';
import { TratamientoService } from '../../../../../services/tratamiento.service';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent {
  @Input() petId: number | null = null;

  constructor(
    private petService: PetService,
    private tratamientoService: TratamientoService,
    private router: Router,
  ) {}

  formPet: Pet = new Pet();
  fechaNacimientoStr: string = '';

  errorMessage: string | null = null;
  successMessage: string | null = null;
  editingPetId: number | null = null;

  ngOnInit(): void {
    if (this.petId) {
      this.petService.findById(this.petId).pipe(
            mergeMap(
              (pet) => {
                this.formPet = pet;
                return this.tratamientoService.findTratamientosPet(pet.id ?? 0);
              }
            )
          ).subscribe(
            (tratamientos) => {
              this.formPet.tratamientos = tratamientos;
            }
          );
      this.fechaNacimientoStr = new Date(this.formPet.fechaNacimiento)
        .toISOString()
        .split('T')[0];
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
    if (!this.fechaNacimientoStr) {
      this.errorMessage = 'Fecha de nacimiento requerida';
      return;
    }
    if (this.formPet.peso <= 0) {
      this.errorMessage = 'Peso debe ser mayor a 0';
      return;
    }
    if (!this.formPet.urlFoto.trim()) {
      this.errorMessage = 'URL de foto requerida';
      return;
    }

    // El input date bindea un string, hay que convertirlo a Date
    this.formPet.fechaNacimiento = new Date(this.fechaNacimientoStr);

    this.petService.savePet(this.formPet);

    if (this.petId) {
      this.router.navigate(['/vet/pets']);
    } else {
      this.successMessage = 'Mascota guardada correctamente';
      this.formPet = new Pet(); // Resetea el formulario
    }
  }
}
