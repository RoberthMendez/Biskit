import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-detail-item',
  templateUrl: './client-detail-item.component.html',
})
export class ClientDetailItemComponent {
  @Input() icon: 'cedula' | 'telefono' | 'correo' = 'cedula';
  @Input() label!: string;
  @Input() value!: string | number | null | undefined;
}
