import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PetDTO } from '../../../../models/dtos/pet-dto';
import { Client } from '../../../../models/Client/client';
import { ItemTratamientoDto } from '../../../../models/dtos/item-tratamiento-dto';
import { PetService } from '../../../../services/pet.service';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { CardInfoPetComponent } from './card-info-pet/card-info-pet.component';
import { CardInfoOwnerComponent } from './card-info-owner/card-info-owner.component';
import { TreatmentsCardComponent } from '../../../reusables/treatments-card/treatments-card.component';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-info-pet',
  imports: [
    CardInfoPetComponent,
    CardInfoOwnerComponent,
    TreatmentsCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './info-pet.component.html',
})
export class InfoPetComponent {
  pet!: PetDTO;
  owner: Client = new Client();
  tratamientos: ItemTratamientoDto[] = [];
  vetId!: number;
  basePath = '';

  constructor(
    private petService: PetService,
    private vetService: VetService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('petId');
    const petId = Number(id);
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    const isAdminView = routePath.startsWith('admin/');
    const contextParam = isAdminView ? 'idAdmin' : 'vetId';
    this.vetId = Number(this.route.snapshot.paramMap.get(contextParam));
    this.basePath = `/${isAdminView ? 'admin' : 'vet'}/${this.vetId}`;

    if (!id || Number.isNaN(petId)) {
      console.error('Parametro petId invalido en la ruta:', id);
      return;
    }

    forkJoin({
      pet: this.petService.findById(petId),
      owner: this.petService.getPetOwner(petId),
      tratamientos: this.petService.getPetTratamientos(petId),
    }).subscribe(({ pet, owner, tratamientos }) => {
      this.pet = pet;
      this.owner = owner;
      this.tratamientos = tratamientos;
    });
  }

  onEstadoChange(nuevoEstado: boolean): void {
    if (this.pet.id != null) {
      this.pet.estado = nuevoEstado;

      this.petService.updateEstado(this.pet.id).subscribe({
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          this.pet.estado = !nuevoEstado;
        },
      });
    }
  }
}
