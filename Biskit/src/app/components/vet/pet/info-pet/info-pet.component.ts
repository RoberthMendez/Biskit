import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Pet } from '../../../../models/Pets/pet';
import { PetService } from '../../../../services/pet.service';
import { VetService } from '../../../../services/vet.service';
import { TratamientoService } from '../../../../services/tratamiento.service';
import { CardInfoPetComponent } from './card-info-pet/card-info-pet.component';
import { CardInfoOwnerComponent } from './card-info-owner/card-info-owner.component';
import { CardInfoTratamientosComponent } from './card-info-tratamientos/card-info-tratamientos.component';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-info-pet',
  imports: [
    CardInfoPetComponent,
    CardInfoOwnerComponent,
    CardInfoTratamientosComponent,
    RouterLink,
  ],
  templateUrl: './info-pet.component.html',
})
export class InfoPetComponent {
  pet!: Pet;
  vetId!: number;
  basePath = '';

  constructor(
    private petService: PetService,
    private vetService: VetService,
    private tratamientoService: TratamientoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.comprobarIds();

    const id = this.route.snapshot.paramMap.get('petId');
    const petId = Number(id);
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const contextParam = routePath.startsWith('admin/') ? 'idAdmin' : 'vetId';
    this.vetId = Number(this.route.snapshot.paramMap.get(contextParam));
    this.basePath = `/${routePath.startsWith('admin/') ? 'admin' : 'vet'}/${this.vetId}`;

    if (!id || Number.isNaN(petId)) {
      console.error('Parametro petId invalido en la ruta:', id);
      return;
    }

    this.petService
      .findById(petId)
      .pipe(
        mergeMap((pet) => {
          this.pet = pet;
          return this.tratamientoService.findTratamientosByPetId(pet.id ?? 0);
        }),
      )
      .subscribe((tratamientos) => {
        this.pet.tratamientos = tratamientos;
      });
  }

  onEstadoChange(nuevoEstado: boolean): void {
    if (this.pet.id != null) {
      this.pet.estado = nuevoEstado;

      this.petService.updateEstado(this.pet.id, nuevoEstado).subscribe({
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.pet.estado = !nuevoEstado;
        },
      });
    }
  }

  private comprobarIds() {
    const vetIdParam = Number(this.route.snapshot.paramMap.get('vetId'));
    if (vetIdParam) {
      this.vetService.existsById(vetIdParam).subscribe({
        next: () => {
          this.vetId = vetIdParam;
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Veterinario no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }

    const petIdParam = Number(this.route.snapshot.paramMap.get('petId'));
    if (petIdParam) {
      this.petService.existsById(petIdParam).subscribe({
        next: () => {},
        error: (error) => {
          const mensaje = error.error?.detalle || 'Mascota no encontrada';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }
  }
}
