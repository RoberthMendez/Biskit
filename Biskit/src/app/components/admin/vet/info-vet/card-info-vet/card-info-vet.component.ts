import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Vet } from '../../../../../models/Vets/vet-cl';

@Component({
  selector: 'app-card-info-vet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-info-vet.component.html',
  host: {
    class: 'block w-full',
  },
})
export class CardInfoVetComponent {
  @Input({ required: true }) vet!: Vet;
  @Input({ required: true }) adminId!: number;
  @Input() onDelete?: (vetId: number) => void;

}