import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../../models/Client/client';

@Component({
  selector: 'app-card-info-owner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info-owner.component.html',
})
export class CardInfoOwnerComponent {
  @Input() owner!: Client;
}
