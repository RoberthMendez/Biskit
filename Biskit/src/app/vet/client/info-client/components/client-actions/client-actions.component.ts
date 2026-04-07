import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientCL } from '../../../../../modelo/Client/client-cl';

@Component({
  selector: 'app-client-actions',
  templateUrl: './client-actions.component.html',
  imports: [RouterLink],
})
export class ClientActionsComponent {
  @Input() client!: ClientCL;
  @Output() deleteClient = new EventEmitter<number>();

  onDelete(): void {
    if (this.client?.id != null) {
      this.deleteClient.emit(this.client.id);
    }
  }
}
