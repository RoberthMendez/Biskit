import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PetCl } from '../../../../models/Pets/Pet/pet-cl';
import { PetService } from '../../../../services/pet.service';
import { FooterComponent } from '../../../reusables/footer/footer.component';
import { CardPetComponent } from './card-pet/card-pet.component';


@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [FooterComponent, CardPetComponent, FormsModule, RouterLink],
  templateUrl: './pets.component.html',
})
export class PetsComponent {
  
  // Base de datos falsa
  pets: PetCl[] = [];

  // Búsqueda de mascota
  searchTerm: string = '';

  constructor(private petService: PetService) {
  }

  ngOnInit() {
    this.pets = this.petService.findAll();
    this.petService.imprimirMascotas();
  }


  get filteredPets(): PetCl[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.pets;
    return this.pets.filter((pet) =>
      pet.nombre.toLowerCase().includes(term)
    );
  }

}
