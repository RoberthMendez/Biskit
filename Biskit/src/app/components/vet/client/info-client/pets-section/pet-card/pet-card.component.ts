import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../../../../../models/Pets/pet';

@Component({
  selector: 'app-pet-card',
  imports: [CommonModule],
  templateUrl: './pet-card.component.html',
})
export class PetCardComponent {
  @Input() pet!: Pet;

  getEdad(fechaNacimiento: string | Date): number {

    if (!fechaNacimiento) 
      return 0;
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad;
      
  }
}
