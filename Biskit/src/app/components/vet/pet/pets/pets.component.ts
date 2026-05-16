import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetDTO } from '../../../../models/dtos/pet-dto';
import { PetService } from '../../../../services/pet.service';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { CardPetComponent } from './card-pet/card-pet.component';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';
import { BotonFiltrosComponent } from '../../../reusables/boton-filtros/boton-filtros.component';
import { EmptyResultsComponent } from '../../../reusables/empty-results/empty-results.component';

type PetListado = PetDTO & {
  tratamientos?: Array<{ vet?: { id?: number } | null }>;
};

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CardPetComponent,
    FormsModule,
    RouterLink,
    BackButtonComponent,
    BotonFiltrosComponent,
    EmptyResultsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pets.component.html',
})
export class PetsComponent {
  public pets: PetListado[] = [];
  public petsFiltrados: PetListado[] = [];
  public vetId: number = 0;
  public basePath = '';
  public isAdminView = false;
  public showOnlyMyPets: boolean = false;
  public hayFiltrosActivos: boolean = false;
  public isLoadingPets = true;
  public showLoadingPets = true;
  public loadingExiting = false;
  public showCards = false;

  public searchTerm: string = '';

  @ViewChild(BotonFiltrosComponent) botonFiltros?: BotonFiltrosComponent;

  private loadingPetsTimeoutId?: ReturnType<typeof setTimeout>;
  private showCardsTimeoutId?: ReturnType<typeof setTimeout>;

  constructor(
    private petService: PetService,
    private vetService: VetService,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    this.isAdminView = routePath.startsWith('admin/');

    const contextParam = this.isAdminView ? 'idAdmin' : 'vetId';
    this.vetId = Number(this.route.snapshot.paramMap.get(contextParam));
    this.basePath = `/${this.isAdminView ? 'admin' : 'vet'}/${this.vetId}`;

    this.petService.findAll().subscribe(
      (pets) => {
        this.pets = pets;
        this.finishLoadingPets();
      },
      () => {
        this.finishLoadingPets();
      },
    );
  }

  ngOnDestroy(): void {
    if (this.loadingPetsTimeoutId) {
      clearTimeout(this.loadingPetsTimeoutId);
    }
    if (this.showCardsTimeoutId) {
      clearTimeout(this.showCardsTimeoutId);
    }
  }

  // Capturar filtros emitidos desde el componente boton-filtros
  onFiltrosAplicados(petsFiltrados: PetListado[] | any) {
    this.petsFiltrados = Array.isArray(petsFiltrados) ? [...petsFiltrados] : [];
    this.hayFiltrosActivos = true;
  }

  // Clear search term and any applied filters (also resets boton-filtros state)
  clearAllFilters(): void {
    this.searchTerm = '';
    this.hayFiltrosActivos = false;
    this.petsFiltrados = [];
    this.showOnlyMyPets = false;
    this.botonFiltros?.resetWithoutEmit();
  }

  private finishLoadingPets(): void {
    if (this.loadingPetsTimeoutId) {
      clearTimeout(this.loadingPetsTimeoutId);
    }

    this.loadingPetsTimeoutId = setTimeout(() => {
      this.isLoadingPets = false;
      this.loadingExiting = true;
      this.loadingPetsTimeoutId = undefined;

      if (this.showCardsTimeoutId) clearTimeout(this.showCardsTimeoutId);
      this.showCardsTimeoutId = setTimeout(() => {
        this.showCards = true;
        this.showLoadingPets = false;
        this.loadingExiting = false;
        this.showCardsTimeoutId = undefined;
      }, 20);
    }, 500);
  }

  get filteredPets(): PetListado[] {
    // Si hay filtros activos, usar siempre los resultados filtrados, aunque estén vacíos
    if (this.hayFiltrosActivos) {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) return this.petsFiltrados;
      return this.petsFiltrados.filter((pet) =>
        pet.nombre.toLowerCase().includes(term),
      );
    }

    let source = this.pets;
    if (this.showOnlyMyPets && this.vetId) {
      source = this.pets.filter((pet) =>
        (pet.tratamientos ?? []).some((t) => t.vet?.id === this.vetId),
      );
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return source;
    return source.filter((pet) => pet.nombre.toLowerCase().includes(term));
  }
}
