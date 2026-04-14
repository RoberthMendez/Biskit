import { Component, Input } from '@angular/core';
import { Pet } from '../../../../models/Pets/pet';
import { TreatmentItemComponent } from '../treatment-item/treatment-item.component';
import { Tratamiento } from '../../../../models/Tratamiento/tratamiento';

@Component({
  selector: 'app-treatments-section',
  standalone: true,
  templateUrl: './treatments-section.component.html',
  imports: [TreatmentItemComponent],
})
export class TreatmentsSectionComponent {
  @Input() pet!: Pet;
}
