import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Pet } from '../../../models/Pets/pet';
import { Vet } from '../../../models/Vets/vet-cl';
import { Droga } from '../../../models/Droga/droga';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';
import { TratamientoDto } from '../../../models/dtos/tratamiento-dto';
import { PetService } from '../../../services/pet.service';
import { VetService } from '../../../services/vet.service';
import { TratamientoService } from '../../../services/tratamiento.service';
import { DrogasService } from '../../../services/drogas.service';

class DrugRowState {
  searchText = '';
  selectedDrug: Droga | null = null;
  open = false;
}

@Component({
  selector: 'app-add-tratamiento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-tratamiento.component.html',
})
export class AddTratamientoComponent implements OnInit {
  
  pets: Pet[] = [];
  vets: Vet[] = [];
  drogas: Droga[] = [];
  vetId: number | null = null;
  basePath = '';
  isAdminView = false;

  tratamiento: Tratamiento = new Tratamiento();
  fechaForm = this.getTodayDateString();
  petSearchText = '';
  vetSearchText = '';
  petDropdownOpen = false;
  vetDropdownOpen = false;
  drugRows: DrugRowState[] = [this.createDrugRow()];
  loadingPets = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  backLink = '';
  backLabel = 'Lista de Mascotas';
  private preselectedPetId: number | null = null;
  private editTratamientoId: number | null = null;
  private loadedTratamiento: Tratamiento | null = null;
  private requestedPetPrefill = false;
  private requestedVetPrefill = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private vetService: VetService,
    private tratamientoService: TratamientoService,
    private drogasService: DrogasService,
  ) {}

  ngOnInit(): void {
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    this.isAdminView = routePath.startsWith('admin/');

    const contextParam = this.isAdminView ? 'idAdmin' : 'vetId';
    this.vetId = this.resolveContextVetId(contextParam);
    this.basePath = this.vetId != null
      ? `/${this.isAdminView ? 'admin' : 'vet'}/${this.vetId}`
      : `/${this.isAdminView ? 'admin' : 'vet'}`;

    const petIdParam = this.route.snapshot.paramMap.get('petId');
    this.preselectedPetId = petIdParam ? Number(petIdParam) : null;
    this.updateBackLink();

    const tratamientoIdParam =
      this.route.snapshot.queryParamMap.get('tratamientoId') ??
      this.route.snapshot.paramMap.get('tratamientoId');

    if (tratamientoIdParam) {
      const tratamientoId = Number(tratamientoIdParam);
      if (!Number.isNaN(tratamientoId)) {
        this.tratamiento.id = tratamientoId;
        this.editTratamientoId = tratamientoId;
      }
    }

    if (this.editTratamientoId != null) {
      this.loadTratamientoForEdit(this.editTratamientoId);
    }

    this.loadingPets = true;

    this.vetService.findAll().subscribe({
      next: (vets) => {
        this.vets = vets;
        this.syncEditFormData();
        this.syncVetSelectionFromRoute();
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar los veterinarios disponibles.';
      },
    });

    this.petService.findAll().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.loadingPets = false;
        this.syncEditFormData();
        this.syncPetSelectionFromQuery();
      },
      error: () => {
        this.loadingPets = false;
        this.errorMessage = 'No fue posible cargar las mascotas disponibles.';
      },
    });

    this.drogasService.findAll().subscribe({
      next: (drogas) => {
        this.drogas = drogas;
        this.syncEditFormData();
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar las drogas disponibles.';
      },
    });

  }

  get isEditMode(): boolean {
    return this.tratamiento.id != null;
  }

  get filteredPets(): Pet[] {
    const normalizedSearch = this.petSearchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.pets;
    }

    return this.pets.filter((pet) => {
      const nameMatch = pet.nombre?.toLowerCase().includes(normalizedSearch);
      const breedMatch = pet.raza?.nombre?.toLowerCase().includes(normalizedSearch);
      const speciesMatch = pet.raza?.especie?.nombre
        ?.toLowerCase()
        .includes(normalizedSearch);

      return Boolean(nameMatch || breedMatch || speciesMatch);
    });
  }

  get filteredVets(): Vet[] {
    const normalizedSearch = this.vetSearchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.vets;
    }

    return this.vets.filter((vet) => vet.nombre?.toLowerCase().includes(normalizedSearch));
  }

  filteredDrogas(index: number): Droga[] {
    const row = this.drugRows[index];
    const normalizedSearch = row?.searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.drogas;
    }

    return this.drogas.filter((drug) =>
      drug.nombre?.toLowerCase().includes(normalizedSearch),
    );
  }

  selectPet(pet: Pet): void {
    this.tratamiento.pet = pet;
    this.petSearchText = pet.nombre || '';
    this.petDropdownOpen = false;
  }

  selectVet(vet: Vet): void {
    this.tratamiento.vet = vet;
    this.vetSearchText = vet.nombre;
    this.vetDropdownOpen = false;
  }

  selectDrug(index: number, drug: Droga): void {
    const row = this.drugRows[index];

    if (!row) {
      return;
    }

    row.selectedDrug = drug;
    row.searchText = drug.nombre;
    row.open = false;
  }

  agregarDroga(): void {
    this.drugRows.push(this.createDrugRow());
  }

  eliminarDroga(index: number): void {
    if (this.drugRows.length === 1) {
      this.drugRows[0] = this.createDrugRow();
      return;
    }

    this.drugRows.splice(index, 1);
  }

  openPetDropdown(): void {
    this.petDropdownOpen = true;
  }

  closePetDropdown(): void {
    window.setTimeout(() => {
      this.petDropdownOpen = false;
    }, 120);
  }

  openVetDropdown(): void {
    this.vetDropdownOpen = true;
  }

  closeVetDropdown(): void {
    window.setTimeout(() => {
      this.vetDropdownOpen = false;
    }, 120);
  }

  openDrugDropdown(index: number): void {
    const row = this.drugRows[index];

    if (row) {
      row.open = true;
    }
  }

  closeDrugDropdown(index: number): void {
    const row = this.drugRows[index];

    if (!row) {
      return;
    }

    window.setTimeout(() => {
      row.open = false;
    }, 120);
  }

  guardarTratamiento(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.tratamiento.pet?.id || !this.tratamiento.vet?.id) {
      this.errorMessage = 'Selecciona una mascota y un veterinario válidos.';
      return;
    }

    const selectedDrogas = this.drugRows
      .map((row) => row.selectedDrug)
      .filter((drug): drug is Droga => Boolean(drug?.id));

    if (selectedDrogas.length === 0) {
      this.errorMessage = 'Agrega al menos una droga al tratamiento.';
      return;
    }

    this.saving = true;
    const petId = this.tratamiento.pet.id;

    const tratamientoDto = new TratamientoDto(
      this.tratamiento.id,
      this.fechaForm,
      this.tratamiento.pet.id,
      this.tratamiento.vet.id,
      selectedDrogas.map((droga) => droga.id!),
    );

    this.tratamientoService.saveTratamiento(tratamientoDto).subscribe({
      next: () => {
        this.saving = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.successMessage = this.isEditMode
          ? 'Cambios guardados correctamente'
          : 'Tratamiento guardado correctamente';

        setTimeout(() => {
          this.router.navigateByUrl(`${this.basePath}/pets/${petId}`);
        }, 600);
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.errorMessage = this.manejarError(error);
      },
    });
  }

  private manejarError(error: HttpErrorResponse): string {

    if (error.status === 400 && error.error) {
      return (
        error.error.detalle ||
        error.error.mensaje ||
        'Error en la solicitud.'
      );
    }

    if (error.status === 500) {
      return 'Ocurrió un error interno en el servidor.';
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    return 'No fue posible guardar el tratamiento.';
  }

  private createDrugRow(): DrugRowState {
    return new DrugRowState();
  }

  private createDrugRowWithSelection(drug: Droga): DrugRowState {
    const row = new DrugRowState();
    row.selectedDrug = drug;
    row.searchText = drug.nombre;
    return row;
  }

  private updateBackLink(): void {
    if (this.preselectedPetId != null && !Number.isNaN(this.preselectedPetId)) {
      this.backLink = `${this.basePath}/pets/${this.preselectedPetId}`;
      this.backLabel = 'Información de la Mascota';
      return;
    }

    this.backLink = `${this.basePath}/pets`;
    this.backLabel = 'Lista de Mascotas';
  }

  private loadTratamientoForEdit(tratamientoId: number): void {
    this.tratamientoService.findById(tratamientoId).subscribe({
      next: (tratamiento) => {
        this.loadedTratamiento = tratamiento;
        this.syncEditFormData();
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar el tratamiento a editar.';
      },
    });
  }

  private syncEditFormData(): void {
    if (!this.loadedTratamiento) {
      return;
    }

    const currentTratamiento = this.loadedTratamiento;
    this.tratamiento.id = currentTratamiento.id;
    this.fechaForm = this.toDateInputValue(currentTratamiento.fecha);

    const petId = currentTratamiento.pet?.id;
    if (petId != null) {
      const selectedPet = this.findPetInCatalog(petId);
      if (selectedPet) {
        this.selectPet(selectedPet);
      } else {
        this.selectPet(currentTratamiento.pet);
        this.loadPetForPrefill(Number(petId));
      }
    }

    const vetId = currentTratamiento.vet?.id;
    if (this.isAdminView) {
      this.tratamiento.vet = new Vet();
      this.vetSearchText = '';
    } else if (vetId != null) {
      const selectedVet =
        this.vets.find((candidate) => candidate.id === vetId) ?? currentTratamiento.vet;
      this.selectVet(selectedVet);
    }

    const selectedDrogas = (currentTratamiento.drogas ?? [])
      .map((drug) => this.drogas.find((candidate) => candidate.id === drug.id) ?? drug)
      .filter((drug) => drug.id != null);

    this.drugRows = selectedDrogas.length
      ? selectedDrogas.map((drug) => this.createDrugRowWithSelection(drug))
      : [this.createDrugRow()];
  }

  private syncPetSelectionFromQuery(): void {
    if (this.preselectedPetId == null) {
      return;
    }

    const pet = this.findPetInCatalog(this.preselectedPetId);

    if (pet) {
      this.selectPet(pet);
    }
  }

  private syncVetSelectionFromRoute(): void {
    if (this.isAdminView || this.isEditMode || this.vetId == null) {
      return;
    }

    const vet = this.findVetInCatalog(this.vetId);

    if (vet) {
      this.selectVet(vet);
      return;
    }

    this.loadVetForPrefill(this.vetId);
  }

  private findPetInCatalog(petId: number | string): Pet | undefined {
    const numericPetId = Number(petId);
    if (Number.isNaN(numericPetId)) {
      return undefined;
    }

    return this.pets.find((candidate) => Number(candidate.id) === numericPetId);
  }

  private findVetInCatalog(vetId: number | string): Vet | undefined {
    const numericVetId = Number(vetId);
    if (Number.isNaN(numericVetId)) {
      return undefined;
    }

    return this.vets.find((candidate) => Number(candidate.id) === numericVetId);
  }

  private loadPetForPrefill(petId: number): void {
    if (this.requestedPetPrefill || Number.isNaN(petId)) {
      return;
    }

    this.requestedPetPrefill = true;
    this.petService.findById(petId).subscribe({
      next: (pet) => {
        this.selectPet(pet);
      },
      error: () => {
        this.requestedPetPrefill = false;
      },
    });
  }

  private loadVetForPrefill(vetId: number): void {
    if (this.requestedVetPrefill || Number.isNaN(vetId)) {
      return;
    }

    this.requestedVetPrefill = true;
    this.vetService.findById(vetId).subscribe({
      next: (vet) => {
        this.selectVet(vet);
      },
      error: () => {
        this.requestedVetPrefill = false;
      },
    });
  }

  private resolveContextVetId(contextParam: string): number | null {
    const routeValue = this.route.snapshot.paramMap.get(contextParam);
    const routeId = routeValue != null ? Number(routeValue) : NaN;

    if (!Number.isNaN(routeId) && routeId > 0) {
      return routeId;
    }

    const storedRole = localStorage.getItem('authRole');
    const storedId = Number(localStorage.getItem('authId'));

    if (storedRole === 'VETERINARIO' && !Number.isNaN(storedId) && storedId > 0) {
      return storedId;
    }

    return null;
  }

  private getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toDateInputValue(value: Date | string | null | undefined): string {
    if (!value) {
      return this.getTodayDateString();
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return this.getTodayDateString();
    }

    return date.toISOString().slice(0, 10);
  }
}
