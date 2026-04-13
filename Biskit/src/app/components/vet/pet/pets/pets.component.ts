import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Pet } from '../../../../models/Pets/pet';
import { PetService } from '../../../../services/pet.service';
import { CardPetComponent } from './card-pet/card-pet.component';


@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CardPetComponent, FormsModule, RouterLink],
  templateUrl: './pets.component.html',
})
export class PetsComponent {
  
  pets: Pet[] = [];

  // Búsqueda de mascota
  searchTerm: string = '';

  constructor(private petService: PetService) {}

  ngOnInit() {
    this.petService.findAll().subscribe(
      (pets) => {
        this.pets = pets;
      }
    );
  }

  get filteredPets(): Pet[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.pets;
    return this.pets.filter((pet) =>
      pet.nombre.toLowerCase().includes(term)
    );
  }

}
