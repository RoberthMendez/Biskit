import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
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
export class PetsComponent implements AfterViewInit {
  public pets: PetListado[] = [];
  public petsFiltrados: PetListado[] = [];
  public basePath = '';
  public isAdminView = false;
  public vetId: number | undefined;
  public showOnlyMyPets: boolean = false;
  public hayFiltrosActivos: boolean = false;
  public isLoadingPets = true;

  public searchTerm: string = '';

  @ViewChild(BotonFiltrosComponent) botonFiltros?: BotonFiltrosComponent;

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
    this.setReducedMotionPreference();

    this.basePath = `/${this.isAdminView ? 'admin' : 'vet'}`;

    // Obtener vetId del servicio correspondiente
    if (this.isAdminView) {
      this.adminService.getDetails().subscribe(
        (admin) => {
          this.vetId = admin.id;
        },
        () => {
          this.vetId = undefined;
        },
      );
    } else {
      this.vetService.getDetails().subscribe(
        (vet) => {
          this.vetId = vet.id;
        },
        () => {
          this.vetId = undefined;
        },
      );
    }

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

  ngAfterViewInit(): void {
    this.scheduleCardRevealRefresh();
  }

  ngOnDestroy(): void {
    this.clearPetAnimations();
  }

  // Capturar filtros emitidos desde el componente boton-filtros
  onFiltrosAplicados(petsFiltrados: PetListado[] | any) {
    this.petsFiltrados = Array.isArray(petsFiltrados) ? [...petsFiltrados] : [];
    this.scheduleCardRevealRefresh();
  }

  // Clear search term and any applied filters (also resets boton-filtros state)
  clearAllFilters(): void {
    this.searchTerm = '';
    this.hayFiltrosActivos = false;
    this.petsFiltrados = [];
    this.showOnlyMyPets = false;
    this.botonFiltros?.resetWithoutEmit();
    this.scrollListToTop();
    this.scheduleCardRevealRefresh();
  }

  onSearchTermChange(value: string): void {
    this.searchTerm = value;
    this.scrollListToTop();

    if (this.searchRevealTimeoutId) {
      clearTimeout(this.searchRevealTimeoutId);
    }

    this.searchRevealTimeoutId = setTimeout(() => {
      this.scheduleCardRevealRefresh();
      this.searchRevealTimeoutId = undefined;
    }, 260);
  }

  private scrollListToTop(): void {
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('.app-shell')
        ?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
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

  // CÓDIGO DE ANIMACIONES
  public showLoadingPets = true;
  public loadingExiting = false;
  public showCards = false;
  public prefersReducedMotion = false;

  private loadingPetsTimeoutId?: ReturnType<typeof setTimeout>;
  private showCardsTimeoutId?: ReturnType<typeof setTimeout>;
  private searchRevealTimeoutId?: ReturnType<typeof setTimeout>;
  private cardObserver: IntersectionObserver | null = null;
  private cardRevealTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  private cardRevealRafIds: number[] = [];

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
        this.scheduleCardRevealRefresh();
      }, 20);
    }, 500);
  }

  private setReducedMotionPreference(): void {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
  }

  private scheduleCardRevealRefresh(): void {
    const windowRef = window;

    this.cardRevealRafIds.forEach((rafId) =>
      windowRef.cancelAnimationFrame(rafId),
    );
    this.cardRevealRafIds = [];

    const firstRaf = windowRef.requestAnimationFrame(() => {
      const secondRaf = windowRef.requestAnimationFrame(() => {
        this.setupCardObserver();
      });

      this.cardRevealRafIds.push(secondRaf);
    });

    this.cardRevealRafIds.push(firstRaf);
  }

  private setupCardObserver(): void {
    this.disconnectCardObserver();

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('.card-grid .card-item'),
    );

    if (!cards.length) {
      return;
    }

    if (this.prefersReducedMotion) {
      cards.forEach((card) => {
        card.classList.add('card-item-visible');
        card.style.removeProperty('--card-delay');
      });
      return;
    }

    const windowRef = window;
    const transition =
      'opacity 0.34s cubic-bezier(0.22, 1, 0.36, 1), transform 0.34s cubic-bezier(0.22, 1, 0.36, 1), filter 0.34s cubic-bezier(0.22, 1, 0.36, 1)';

    cards.forEach((card) => {
      card.style.removeProperty('--card-delay');
    });

    this.cardObserver = new windowRef.IntersectionObserver(
      (entries, currentObserver) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (!visibleEntries.length) {
          return;
        }

        visibleEntries
          .sort((a, b) =>
            a.target.compareDocumentPosition(b.target) &
            windowRef.Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1,
          )
          .forEach((entry, index) => {
            const card = entry.target as HTMLElement;
            currentObserver.unobserve(card);

            const revealTimeoutId = windowRef.setTimeout(() => {
              card.style.transition = transition;
              card.classList.add('card-item-visible');

              const cleanupTimeoutId = windowRef.setTimeout(() => {
                card.style.transition = '';
              }, 700);

              this.cardRevealTimeoutIds.push(cleanupTimeoutId);
            }, index * 24);

            this.cardRevealTimeoutIds.push(revealTimeoutId);
          });
      },
      { threshold: 0, rootMargin: '22% 0px 32% 0px' },
    );

    cards.forEach((card) => this.cardObserver?.observe(card));
  }

  private disconnectCardObserver(): void {
    this.cardObserver?.disconnect();
    this.cardObserver = null;

    const windowRef = window;
    this.cardRevealTimeoutIds.forEach((timeoutId) =>
      windowRef.clearTimeout(timeoutId),
    );
    this.cardRevealTimeoutIds = [];

    this.cardRevealRafIds.forEach((rafId) =>
      windowRef.cancelAnimationFrame(rafId),
    );
    this.cardRevealRafIds = [];
  }

  private clearPetAnimations(): void {
    if (this.loadingPetsTimeoutId) {
      clearTimeout(this.loadingPetsTimeoutId);
    }
    if (this.showCardsTimeoutId) {
      clearTimeout(this.showCardsTimeoutId);
    }
    if (this.searchRevealTimeoutId) {
      clearTimeout(this.searchRevealTimeoutId);
    }
    this.disconnectCardObserver();
  }
}
