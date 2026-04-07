import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientActionsComponent } from '../client-actions/client-actions.component';
import { ClientCL } from '../../../../../modelo/Client/client-cl';

@Component({
  selector: 'app-client-header',
  imports: [ClientActionsComponent],
  templateUrl: './client-header.component.html',
})
export class ClientHeaderComponent {
  @Input() client!: ClientCL;
  @Output() deleteClient = new EventEmitter<number>();

  onDelete(clientId: number): void {
    this.deleteClient.emit(clientId);
  }
}
