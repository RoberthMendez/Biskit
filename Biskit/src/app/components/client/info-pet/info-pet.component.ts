import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../models/Client/client';
import { Pet } from '../../../models/Pets/pet';
import { TreatmentsCardComponent } from '../../reusables/treatments-card/treatments-card.component';
import { PetCardComponent } from './pet-card/pet-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { mergeMap } from 'rxjs';
import { TratamientoService } from '../../../services/tratamiento.service';
import { ClientService } from '../../../services/client.service';
import { BackButtonComponent } from '../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-info-pet',
  templateUrl: './info-pet.component.html',
  standalone: true,
  imports: [CommonModule, PetCardComponent, TreatmentsCardComponent, BackButtonComponent],
})
export class InfoPetComponent {
  @Input() client: Client = new Client();
  @Input() pet: Pet = new Pet();

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private clientService: ClientService,
    private tratamientoService: TratamientoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.comprobarIds();
    const petId = this.route.snapshot.paramMap.get('petId');
    const clientId = this.route.snapshot.paramMap.get('clientId');

    this.clientService
      .findById(clientId ? Number(clientId) : 0)
      .pipe(
        mergeMap((client) => {
          this.client = client;
          return this.petService.findById(petId ? Number(petId) : 0);
        }),
        mergeMap((pet) => {
          this.pet = pet;
          return this.tratamientoService.findTratamientosByPetId(pet.id ?? 0);
        }),
      )
      .subscribe({
        next: (tratamientos) => {
          this.pet.tratamientos = tratamientos;
        },
        error: () => {
          this.pet.tratamientos = [];
        },
      });
  }

  private comprobarIds(): void {
    const petIdParam = Number(this.route.snapshot.paramMap.get('petId'));
    const clientIdParam = Number(this.route.snapshot.paramMap.get('clientId'));
    this.clientService.existsById(clientIdParam).subscribe({
      next: () => {
      },
      error: (error) => {
        const mensaje = error.error?.detalle || 'Cliente no encontrado';
        this.router.navigate(['/error'], {
          queryParams: { mensaje },
        });
      },
    });

    this.petService.existsById(petIdParam).subscribe({
      next: () => {
      },
      error: (error) => {
        const mensaje = error.error?.detalle || 'Mascota no encontrada';
        this.router.navigate(['/error'], {
          queryParams: { mensaje },
        });
      },
    });

  }
}
