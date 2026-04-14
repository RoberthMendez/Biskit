import { Component, Input } from '@angular/core';
import { PetCardComponent } from '../pet-card/pet-card.component';
import { Client } from '../../../../../models/Client/client';
import { Pet } from '../../../../../models/Pets/pet';

@Component({
  selector: 'app-pets-section',
  templateUrl: './pets-section.component.html',
  imports: [PetCardComponent],
})
export class PetsSectionComponent {
  @Input() client!: Client;
  @Input() pets: Pet[] = [];
}
