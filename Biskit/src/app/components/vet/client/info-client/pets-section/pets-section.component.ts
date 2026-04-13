import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsTableComponent } from './pets-table/pets-table.component';
import { PetCardComponent } from './pet-card/pet-card.component';
import { Pet } from '../../../../../models/Pets/Pet/pet';
import { PetCl } from '../../../../../models/Pets/Pet/pet-cl';

@Component({
  selector: 'app-pets-section',
  imports: [CommonModule, PetsTableComponent, PetCardComponent],
  templateUrl: './pets-section.component.html',
})
export class PetsSectionComponent {
  @Input() pets: PetCl[] = [];
}
