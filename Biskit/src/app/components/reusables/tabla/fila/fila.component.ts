import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[app-fila]',
  imports: [],
  templateUrl: './fila.component.html'
})
export class FilaComponent {

  @Input() celdas: unknown[] = [];

  @Input() alineaciones: Array<'left' | 'center' | 'right'> = [];

}
