import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tratamiento } from '../../../../models/Tratamiento/tratamiento';
import { Droga } from '../../../../models/Droga/droga';

@Component({
  selector: 'app-treatment-item',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './treatment-item.component.html',
})
export class TreatmentItemComponent {
  @Input() t!: Tratamiento;
  @Input() clientId?: number;
  @Input() petId?: number;

  protected getDrugColumns(drogas: Droga[]): Droga[][] {
    const columns: Droga[][] = [];
    for (let i = 0; i < drogas.length; i += 3) {
      columns.push(drogas.slice(i, i + 3));
    }
    return columns;
  }
}
