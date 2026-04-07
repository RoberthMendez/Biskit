// clients-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientFilaComponent } from '../client-fila/client-fila.component';

@Component({
  standalone: true,
  selector: 'app-clients-tabla',
  templateUrl: './clients-tabla.component.html',
  imports: [CommonModule, ClientFilaComponent]
})
export class ClientsTableComponent {
  @Input() clients: any[] = [];
  @Output() delete = new EventEmitter<number>();
}
