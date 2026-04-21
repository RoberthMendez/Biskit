import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  
  public pets: Pet[] = [];
  public vetId: number = 0;

  public searchTerm: string = '';

  constructor(private petService: PetService, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.vetId = Number(this.route.snapshot.paramMap.get('vetId'));
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
