import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../../../models/Pets/pet';
import { PetService } from '../../../../services/pet.service';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { CardPetComponent } from './card-pet/card-pet.component';
import { HttpErrorResponse } from '@angular/common/http';
import { BackButtonComponent } from "../../../reusables/back-button/back-button.component";

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CardPetComponent, FormsModule, RouterLink, BackButtonComponent],
  templateUrl: './pets.component.html',
})
export class PetsComponent {
  public pets: Pet[] = [];
  public vetId: number = 0;
  public basePath = '';
  public isAdminView = false;
  public petsTreatedByVet: Pet[] = [];
  public showOnlyMyPets: boolean = false;

  public searchTerm: string = '';

  constructor(
    private petService: PetService,
    private vetService: VetService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.comprobarIds();
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    this.isAdminView = routePath.startsWith('admin/');

    const contextParam = this.isAdminView ? 'idAdmin' : 'vetId';
    this.vetId = Number(this.route.snapshot.paramMap.get(contextParam));
    this.basePath = `/${this.isAdminView ? 'admin' : 'vet'}/${this.vetId}`;

    this.petService.findAll().subscribe(
      (pets) => {
        this.pets = pets;
      }
    );

    if (!this.isAdminView) {
      this.vetService.getPetsTreatedByVet(this.vetId).subscribe({
        next: (pets) => {
          this.petsTreatedByVet = pets;
        },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error?.detalle || 'Error al obtener mascotas';

        this.router.navigate(['/error'], {
          queryParams: { mensaje },
        });
      },
      });
    }
    
    this.petService.findAll().subscribe((pets) => {
      this.pets = pets;
    });
    
  }

  get filteredPets(): Pet[] {
    const source = this.showOnlyMyPets ? this.petsTreatedByVet : this.pets;
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return source;
    return source.filter((pet) => pet.nombre.toLowerCase().includes(term));
  }

  private comprobarIds(): void {
    const vetIdParam = Number(this.route.snapshot.paramMap.get('vetId'));
    const adminIdParam = Number(this.route.snapshot.paramMap.get('idAdmin'));

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

    if (adminIdParam) {
      this.adminService.existsById(adminIdParam).subscribe({
        next: () => {
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Administrador no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }
  }
}
