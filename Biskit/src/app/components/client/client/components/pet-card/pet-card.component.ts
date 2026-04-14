import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from '../../../../../models/Pets/pet';
import { Client } from '../../../../../models/Client/client';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  imports: [RouterLink],
})
export class PetCardComponent {
  @Input() pet!: Pet;
  @Input() client!: Client;

  getEdad(fechaNacimiento: string | Date): number {
    if (!fechaNacimiento) return 0;

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }
}
