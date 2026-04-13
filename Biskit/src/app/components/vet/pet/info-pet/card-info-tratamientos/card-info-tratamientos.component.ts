import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PetCl } from '../../../../../models/Pets/Pet/pet-cl';

@Component({
  selector: 'app-card-info-tratamientos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './card-info-tratamientos.component.html',
})
export class CardInfoTratamientosComponent {
  @Input() pet!: PetCl;
}
