import { Component, Input } from '@angular/core';
import { ClientCL } from '../../../../../modelo/Client/client-cl';

@Component({
  selector: 'app-client-details',
  imports: [],
  templateUrl: './client-details.component.html',
})
export class ClientDetailsComponent {
  @Input() client!: ClientCL;
}
