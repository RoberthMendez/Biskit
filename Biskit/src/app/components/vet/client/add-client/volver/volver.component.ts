import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-volver',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './volver.component.html',
})
export class VolverComponent {
  @Input() route: string | Array<string | number> = '/vet/clients';
}
