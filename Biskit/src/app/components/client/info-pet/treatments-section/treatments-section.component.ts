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
  @Input() clientId?: number;
  
  protected get sortedTratamientos(): Tratamiento[] {
    return [...(this.pet.tratamientos ?? [])].sort(
      (a, b) => this.getTimestamp(b.fecha) - this.getTimestamp(a.fecha),
    );
  }

  private getTimestamp(value: Date | string): number {
    const parsed = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }
}
