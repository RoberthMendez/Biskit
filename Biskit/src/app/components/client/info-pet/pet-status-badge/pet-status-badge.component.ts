import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pet-status-badge',
  imports: [],
  templateUrl: './pet-status-badge.component.html',
})
export class PetStatusBadgeComponent {
  @Input() estado!: boolean;
}
