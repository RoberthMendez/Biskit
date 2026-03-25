import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PetCl } from '../../../../modelo/Pets/Pet/pet-cl';
import { PetService } from '../../../../services/pet.service';


@Component({
  selector: 'app-card-pet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-pet.component.html',
  styleUrl: './card-pet.component.css',
})
export class CardPetComponent {

  @Input()
  pet!: PetCl;

  constructor(private petService: PetService) {
  }

  onToggleEstado(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.pet.estado = checkbox.checked;
    // Actualizar base de datos
    this.petService.updateEstado(this.pet.id, this.pet.estado);
  }

}
