import { Component, Input } from '@angular/core';
import { PetDTO } from '../../../../models/dtos/pet-dto';
import { PetStatusBadgeComponent } from '../pet-status-badge/pet-status-badge.component';
import { PetBasicInfoComponent } from '../pet-basic-info/pet-basic-info.component';

@Component({
  selector: 'app-pet-card',
  templateUrl: './pet-card.component.html',
  imports: [PetStatusBadgeComponent, PetBasicInfoComponent],
})
export class PetCardComponent {
  @Input() pet: PetDTO = new PetDTO();
}
