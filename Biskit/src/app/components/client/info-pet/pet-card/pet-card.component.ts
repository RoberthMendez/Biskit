import { Component, Input } from '@angular/core';
import { Pet } from '../../../../models/Pets/pet';
import { PetStatusBadgeComponent } from '../pet-status-badge/pet-status-badge.component';
import { PetBasicInfoComponent } from '../pet-basic-info/pet-basic-info.component';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  imports: [PetStatusBadgeComponent, PetBasicInfoComponent],
})
export class PetCardComponent {
  @Input() pet: Pet = new Pet();

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
