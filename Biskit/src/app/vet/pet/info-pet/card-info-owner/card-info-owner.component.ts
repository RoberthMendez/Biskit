import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientCL } from '../../../../modelo/Client/client-cl';

@Component({
  selector: 'app-card-info-owner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-info-owner.component.html',
  styleUrl: './card-info-owner.component.css'
})
export class CardInfoOwnerComponent {
  @Input() owner!: ClientCL;
}
