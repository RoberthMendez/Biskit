import { Component, Input } from '@angular/core';
import { Pet } from '../../../../models/Pets/pet';

@Component({
  selector: 'app-pet-basic-info',
  templateUrl: './pet-basic-info.component.html',
})
export class PetBasicInfoComponent {
  @Input() pet!: Pet;
  @Input() edad!: number;
}
