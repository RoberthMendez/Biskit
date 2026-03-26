import { Component } from '@angular/core';
import { FooterComponent } from '../../../reusables/footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PetCl } from '../../../modelo/Pets/Pet/pet-cl';
import { PetService } from '../../../services/pet.service';
import { CardInfoPetComponent } from './card-info-pet/card-info-pet.component';
import { CardInfoOwnerComponent } from './card-info-owner/card-info-owner.component';
import { CardInfoTratamientosComponent } from './card-info-tratamientos/card-info-tratamientos.component';

@Component({
  selector: 'app-info-pet',
  imports: [
    FooterComponent,
    CardInfoPetComponent,
    CardInfoOwnerComponent,
    CardInfoTratamientosComponent,
    RouterLink,
  ],
  templateUrl: './info-pet.component.html',
  styleUrl: './info-pet.component.css',
})
export class InfoPetComponent {
  pet!: PetCl;

  constructor(
    private petService: PetService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pet = this.petService.findById(id ? Number(id) : 0) || new PetCl();
  }

  onEstadoChange(nuevoEstado: boolean): void {
    // Aquí puedes llamar al servicio para persistir el cambio:
    if (this.pet.id != null) {
    this.petService.updateEstado(this.pet.id, nuevoEstado);
    }
  }
}
