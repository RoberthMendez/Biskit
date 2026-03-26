import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetCl } from '../../../../modelo/Pets/Pet/pet-cl';

@Component({
  selector: 'app-card-info-pet',
  imports: [RouterLink],
  templateUrl: './card-info-pet.component.html',
})
export class CardInfoPetComponent {
  @Input() pet!: PetCl;
  @Output() estadoChange = new EventEmitter<boolean>();

  onToggleEstado(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.estadoChange.emit(checkbox.checked);
  }

}
