import { Component } from '@angular/core';
import { FooterComponent } from '../../../reusables/footer/footer.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pet } from '../../../../models/Pets/pet';
import { PetService } from '../../../../services/pet.service';
import { TratamientoService } from '../../../../services/tratamiento.service';
import { CardInfoPetComponent } from './card-info-pet/card-info-pet.component';
import { CardInfoOwnerComponent } from './card-info-owner/card-info-owner.component';
import { CardInfoTratamientosComponent } from './card-info-tratamientos/card-info-tratamientos.component';
import { mergeMap } from 'rxjs';

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
})
export class InfoPetComponent {
  pet!: Pet;

  constructor(
    private petService: PetService,
    private tratamientoService: TratamientoService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.petService.findById(id ? Number(id) : 0).pipe(
      mergeMap(
        (pet) => {
          this.pet = pet;
          return this.tratamientoService.findTratamientosPet(pet.id ?? 0);
        }
      )
    ).subscribe(
      (tratamientos) => {
        this.pet.tratamientos = tratamientos;
      }
    );

  }

  onEstadoChange(nuevoEstado: boolean): void {
    // Aquí puedes llamar al servicio para persistir el cambio:
    if (this.pet.id != null) {
      // this.petService.updateEstado(this.pet.id, nuevoEstado);
    }
  }
}
