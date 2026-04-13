import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetCl } from '../../../../../../models/Pets/Pet/pet-cl';

@Component({
  selector: 'app-pet-card',
  imports: [CommonModule],
  templateUrl: './pet-card.component.html',
})
export class PetCardComponent {
  @Input() pet!: PetCl;
}
