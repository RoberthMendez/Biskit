import { Component, Input } from '@angular/core';
import { PetDTO } from '../../../../models/dtos/pet-dto';

@Component({
  selector: 'app-pet-basic-info',
  templateUrl: './pet-basic-info.component.html',
})
export class PetBasicInfoComponent {
  @Input() pet!: PetDTO;
  @Input() edad!: number;
}
