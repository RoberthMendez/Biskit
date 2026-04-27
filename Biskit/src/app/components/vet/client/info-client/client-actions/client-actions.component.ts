import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../../../../models/Client/client';

@Component({
  selector: 'app-client-actions',
  standalone: true,
  templateUrl: './client-actions.component.html',
  imports: [RouterLink],
})
export class ClientActionsComponent {
  @Input() client!: Client;
  @Input() basePath = '/vet/clients';
  @Output() deleteClient = new EventEmitter<number>();

  onDelete(): void {
    if (this.client?.id != null) {
      this.deleteClient.emit(this.client.id);
    }
  }
}
