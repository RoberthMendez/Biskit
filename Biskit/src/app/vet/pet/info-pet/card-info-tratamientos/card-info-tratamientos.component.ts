import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PetCl } from '../../../../modelo/Pets/Pet/pet-cl';

@Component({
  selector: 'app-card-info-tratamientos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './card-info-tratamientos.component.html',
  styleUrl: './card-info-tratamientos.component.css'
})
export class CardInfoTratamientosComponent {
  @Input() pet!: PetCl;
}
