import { Component, Input } from '@angular/core';
import { Client } from '../../../../../models/Client/client';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [],
  templateUrl: './client-details.component.html',
})
export class ClientDetailsComponent {
  @Input() client!: Client;
}
