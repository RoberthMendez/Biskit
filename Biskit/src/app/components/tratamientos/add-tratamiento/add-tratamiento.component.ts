import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private preselectedPetId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private vetService: VetService,
    private tratamientoService: TratamientoService,
    private drogasService: DrogasService,
  ) {}

  ngOnInit(): void {

    const petIdParam = this.route.snapshot.paramMap.get('petId');
    this.preselectedPetId = petIdParam ? Number(petIdParam) : null;

    const tratamientoIdParam =
      this.route.snapshot.queryParamMap.get('tratamientoId') ??
      this.route.snapshot.paramMap.get('tratamientoId');

    if (tratamientoIdParam) {
      const tratamientoId = Number(tratamientoIdParam);
      if (!Number.isNaN(tratamientoId)) {
        this.tratamiento.id = tratamientoId;
      }
    }

    this.loadingPets = true;

    this.vetService.findAll().subscribe({
      next: (vets) => {
        this.vets = vets;
      },
      error: () => {
        this.errorMessage = 'No fue posible cargar los veterinarios disponibles.';
      },
    });

    this.petService.findAll().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.loadingPets = false;
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
    this.petSearchText = pet.nombre;
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
          this.router.navigate(['/vet/pets', petId]);
        }, 600);
      },
      error: () => {
        this.saving = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.errorMessage = 'No fue posible guardar el tratamiento.';
      },
    });
  }

  private createDrugRow(): DrugRowState {
    return new DrugRowState();
  }

  private syncPetSelectionFromQuery(): void {
    if (this.preselectedPetId == null) {
      return;
    }

    const pet = this.pets.find((candidate) => candidate.id === this.preselectedPetId);

    if (pet) {
      this.selectPet(pet);
    }
  }

  private getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
