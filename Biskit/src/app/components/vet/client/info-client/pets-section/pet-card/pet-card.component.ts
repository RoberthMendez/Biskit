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
}
