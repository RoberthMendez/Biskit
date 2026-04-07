// client-row.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'tr[app-client-fila]',
  templateUrl: './client-fila.component.html'
})
export class ClientFilaComponent {
  @Input() client: any;
  @Output() delete = new EventEmitter<number>();
}