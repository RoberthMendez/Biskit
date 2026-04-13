// client-row.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'tr[app-client-fila]',
  templateUrl: './client-fila.component.html',
  imports: [RouterLink],
})
export class ClientFilaComponent {
  @Input() client: any;
  @Output() delete = new EventEmitter<number>();
}
