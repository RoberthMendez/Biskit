import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../../../models/Pets/pet';
import { PetService } from '../../../../services/pet.service';
import { VetService } from '../../../../services/vet.service';
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
  public petsTreatedByVet: Pet[] = [];
  public showOnlyMyPets: boolean = false;

  public searchTerm: string = '';

  constructor(private petService: PetService, private vetService: VetService, private route: ActivatedRoute) {}

  ngOnInit() {
    
    this.vetId = Number(this.route.snapshot.paramMap.get('vetId'));
    this.petService.findAll().subscribe(
      (pets) => {
        this.pets = pets;
      }
    );

    this.vetService.getPetsTreatedByVet(this.vetId).subscribe(
      (pets) => {
        this.petsTreatedByVet = pets;
      }
    );

  }

  get filteredPets(): Pet[] {
    const source = this.showOnlyMyPets ? this.petsTreatedByVet : this.pets;
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return source;
    return source.filter((pet) => pet.nombre.toLowerCase().includes(term));
  }

}
