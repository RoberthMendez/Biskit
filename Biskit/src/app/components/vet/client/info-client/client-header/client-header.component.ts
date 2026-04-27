import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientActionsComponent } from '../client-actions/client-actions.component';
import { Client } from '../../../../../models/Client/client';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [ClientActionsComponent],
  templateUrl: './client-header.component.html',
})
export class ClientHeaderComponent {
  @Input() client!: Client;
  @Input() basePath = '/vet/clients';
  @Output() deleteClient = new EventEmitter<number>();

  onDelete(clientId: number): void {
    this.deleteClient.emit(clientId);
  }
}
