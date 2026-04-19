import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tratamiento } from '../../../../models/Tratamiento/tratamiento';

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
}
