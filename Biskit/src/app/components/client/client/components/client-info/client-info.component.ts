import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientDetailItemComponent } from '../client-detail-item/client-detail-item.component';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  imports: [ClientDetailItemComponent],
})
export class ClientInfoComponent {
  @Input() client: any;
}
