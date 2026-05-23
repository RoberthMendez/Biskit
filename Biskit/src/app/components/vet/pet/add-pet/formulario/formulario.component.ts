import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs';

import { Pet } from '../../../../../models/Pets/pet';
import { PetDTO } from '../../../../../models/dtos/pet-dto';
import { Raza } from '../../../../../models/Pets/raza';
import { PetService } from '../../../../../services/pet.service';
import { TratamientoService } from '../../../../../services/tratamiento.service';
import { ClientService } from '../../../../../services/client.service';
import { Client } from '../../../../../models/Client/client';
import { Especie } from '../../../../../models/Pets/especie';
import { Enfermedad } from '../../../../../models/Pets/enfermedad';
import { EspeciesService } from '../../../../../services/especies.service';
import { RazasService } from '../../../../../services/razas.service';
import { EnfermedadesService } from '../../../../../services/enfermedades.service';
import { DatepickerComponent } from '../../../../reusables/date-picker/date-picker.component';
import { Vet } from '../../../../../models/Vets/vet-cl';
import { VetService } from '../../../../../services/vet.service';
import { CitaDto } from '../../../../../models/dtos/cita-dto';

// ─── Tipos de dropdown ─────────────────────────────────────────────────────────
type DropdownKey =
  | 'cliente'
  | 'especie'
  | 'raza'
  | 'enfermedad'
  | 'vet'
  | 'cita';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule, DatepickerComponent],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  private readonly datePickerComponentType = DatepickerComponent;

  @Input() petId: number | null = null;
  @Input() basePath = '';
  @Input() isAdminView = false;
  // ── Formulario ───────────────────────────────────────────────────────────────
  formPet: Pet = new Pet();
  fechaNacimientoStr: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  savingPet = false;
  private loadedPetDto: PetDTO | null = null;

  // ── Listas de datos ──────────────────────────────────────────────────────────s
  clientes: Client[] = [];
  especies: Especie[] = [];
  razas: Raza[] = []; // todas las razas
  razasFiltradas: Raza[] = []; // razas filtradas por especie seleccionada
  enfermedades: Enfermedad[] = [];
  vets: Vet[] = [];
  citasSemana: CitaDto[] = [];

  // ── Textos de búsqueda en los inputs visibles ────────────────────────────────
  clienteSearch: string = '';
  especieSearch: string = '';
  razaSearch: string = '';
  enfermedadSearch: string = '';
  vetSearch: string = '';
  citaSearch: string = '';

  // ── IDs seleccionados (los que se envían al backend) ─────────────────────────
  selectedClienteId: number | null = null;
  selectedEspecieId: number | null = null;
  selectedRazaId: number | null = null;
  selectedEnfermedadId: number | null = null;
  selectedVetId: number | null = null;
  selectedCitaId: number | null = null;

  tieneCita: boolean = false;
  loadingVets: boolean = false;
  loadingLoggedVet: boolean = false;
  loadingCitas: boolean = false;
  citasError: string | null = null;
  private loggedVetId: number | null = null;
  private citasLoadedVetId: number | null = null;

  // ── Estado de dropdowns ──────────────────────────────────────────────────────
  dropdownOpen: Record<DropdownKey, boolean> = {
    cliente: false,
    especie: false,
    raza: false,
    enfermedad: false,
    vet: false,
    cita: false,
  };
  showRazaModalEspecieDropdown: boolean = false;

  // ── Modales ──────────────────────────────────────────────────────────────────
  showAddRazaModal: boolean = false;
  showAddEnfermedadModal: boolean = false;
  isClosingAddRazaModal: boolean = false;
  isClosingAddEnfermedadModal: boolean = false;

  newRazaNombre: string = '';
  newEnfermedadNombre: string = '';
  razaModalEspecieSearch: string = '';

  addRazaError: string | null = null;
  addRazaSuccess: string | null = null;
  addEnfermedadError: string | null = null;
  addEnfermedadSuccess: string | null = null;

  savingRaza: boolean = false;
  savingEnfermedad: boolean = false;
  private closeRazaModalTimeout: ReturnType<typeof setTimeout> | null = null;
  private closeEnfermedadModalTimeout: ReturnType<typeof setTimeout> | null =
    null;

  // ─────────────────────────────────────────────────────────────────────────────

  constructor(
    private petService: PetService,
    private clientService: ClientService,
    private especiesService: EspeciesService,
    private razasService: RazasService,
    private enfermedadesService: EnfermedadesService,
    private vetService: VetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadLists();
    this.loadAppointmentPrerequisites();

    if (this.petId) {
      this.petService
        .findById(this.petId)
        .pipe(
          mergeMap((pet) => {
            this.loadedPetDto = pet;
            this.applyPetDtoToForm(pet);

            return this.petService.getPetTratamientos(this.formPet.id ?? 0);
          }),
        )
        .subscribe((tratamientos) => {
          this.formPet.tratamientos = tratamientos;
        });
    }
  }

  // ─── Carga de datos ───────────────────────────────────────────────────────────
  private loadLists(): void {
    this.clientService.findAll().subscribe((clientes) => {
      this.clientes = clientes;
      this.syncPetSelectionsFromDto();
    });
    this.razasService.findAll().subscribe((razas) => {
      this.razas = razas;
      this.razasFiltradas = razas;
      this.syncPetSelectionsFromDto();
    });
    this.especiesService.findAll().subscribe((especies) => {
      this.especies = especies;
      this.syncPetSelectionsFromDto();
    });
    this.enfermedadesService.findAll().subscribe((enfermedades) => {
      this.enfermedades = enfermedades;
      this.syncPetSelectionsFromDto();
    });
  }

  private loadAppointmentPrerequisites(): void {
    if (this.isAdminView) {
      this.loadVetsForAdmin();
      return;
    }

    this.loadLoggedVet();
  }

  private loadVetsForAdmin(): void {
    if (this.loadingVets || this.vets.length > 0) {
      return;
    }

    this.loadingVets = true;
    this.vetService.findAll().subscribe({
      next: (vets) => {
        this.vets = vets;
        this.loadingVets = false;
      },
      error: () => {
        this.loadingVets = false;
        this.citasError = 'No fue posible cargar los veterinarios.';
      },
    });
  }

  private loadLoggedVet(): void {
    if (this.loadingLoggedVet || this.loggedVetId) {
      return;
    }

    this.loadingLoggedVet = true;
    this.vetService.getDetails().subscribe({
      next: (vet) => {
        this.loggedVetId = vet.id ?? null;
        this.loadingLoggedVet = false;

        if (this.tieneCita && this.loggedVetId) {
          this.loadCitasSemana(this.loggedVetId);
        }
      },
      error: () => {
        this.loadingLoggedVet = false;
        if (this.tieneCita) {
          this.citasError = 'No fue posible identificar el veterinario.';
        }
      },
    });
  }

  private loadCitasSemana(vetId: number): void {
    if (!vetId) {
      this.citasError = this.isAdminView
        ? 'Selecciona un veterinario antes de consultar las citas.'
        : 'No fue posible identificar el veterinario.';
      return;
    }

    const requestedVetId = vetId;
    this.loadingCitas = true;
    this.citasError = null;
    this.citasSemana = [];
    this.selectedCitaId = null;
    this.citaSearch = '';
    this.citasLoadedVetId = null;

    this.vetService.getCitasSemanalesByVetIdSinMascota(vetId, 0).subscribe({
      next: (citas) => {
        if (this.resolveVetIdForCitas() !== requestedVetId) {
          return;
        }

        this.citasSemana = citas;
        this.loadingCitas = false;
        this.citasLoadedVetId = vetId;
      },
      error: () => {
        if (this.resolveVetIdForCitas() !== requestedVetId) {
          return;
        }

        this.loadingCitas = false;
        this.citasError = 'No fue posible cargar las citas de la semana.';
      },
    });
  }

  // ─── Getters de filtrado en tiempo real ───────────────────────────────────────
  get clientesFiltrados(): Client[] {
    const q = this.clienteSearch.toLowerCase();
    return this.clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.cedula.toLowerCase().includes(q),
    );
  }

  get especiesFiltradas(): Especie[] {
    const q = this.especieSearch.toLowerCase();
    return this.especies.filter((e) => e.nombre.toLowerCase().includes(q));
  }

  get especiesFiltradasModalRaza(): Especie[] {
    const q = this.razaModalEspecieSearch.toLowerCase();
    return this.especies.filter((e) => e.nombre.toLowerCase().includes(q));
  }

  get razasFiltradaPorBusqueda(): Raza[] {
    const q = this.razaSearch.toLowerCase();
    return this.razasFiltradas.filter((r) =>
      r.nombre.toLowerCase().includes(q),
    );
  }

  get enfermedadesFiltradas(): Enfermedad[] {
    const q = this.enfermedadSearch.toLowerCase();
    return this.enfermedades.filter((e) => e.nombre.toLowerCase().includes(q));
  }

  get vetsFiltrados(): Vet[] {
    const q = this.vetSearch.toLowerCase();
    return this.vets.filter(
      (v) =>
        (v.nombre ?? '').toLowerCase().includes(q) ||
        (v.cedula ?? '').toLowerCase().includes(q),
    );
  }

  get citasFiltradas(): CitaDto[] {
    const q = this.citaSearch.toLowerCase();
    return this.citasSemana.filter((cita) =>
      this.getCitaLabel(cita).toLowerCase().includes(q),
    );
  }

  // ─── Control de dropdowns ─────────────────────────────────────────────────────
  openDropdown(key: DropdownKey): void {
    // Cierra todos y abre solo el solicitado
    (Object.keys(this.dropdownOpen) as DropdownKey[]).forEach(
      (k) => (this.dropdownOpen[k] = k === key),
    );
  }

  closeAllDropdowns(): void {
    (Object.keys(this.dropdownOpen) as DropdownKey[]).forEach(
      (k) => (this.dropdownOpen[k] = false),
    );
  }

  /** Cierra todos los dropdowns si el clic fue fuera del componente */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    const openKey = (Object.keys(this.dropdownOpen) as DropdownKey[]).find(
      (key) => this.dropdownOpen[key],
    );

    if (!target || !openKey) {
      if (!target?.closest('[data-dropdown="raza-modal-especie"]')) {
        this.showRazaModalEspecieDropdown = false;
      }
      return;
    }

    // Solo mantenemos abierto si el click ocurrió dentro del dropdown activo.
    if (!target.closest(`[data-dropdown="${openKey}"]`)) {
      this.closeAllDropdowns();
    }

    if (!target.closest('[data-dropdown="raza-modal-especie"]')) {
      this.showRazaModalEspecieDropdown = false;
    }
  }

  // ─── Selección de opciones ────────────────────────────────────────────────────
  selectCliente(cliente: Client): void {
    this.clienteSearch = cliente.nombre;
    this.selectedClienteId = cliente.id ?? null;
    this.formPet.owner = { id: cliente.id, nombre: cliente.nombre } as any;
    this.dropdownOpen.cliente = false;
  }

  selectEspecie(especie: Especie): void {
    this.especieSearch = especie.nombre;
    this.selectedEspecieId = especie.id ?? null;
    this.filterRazasByEspecie(especie.id);

    // Resetea raza al cambiar especie
    this.razaSearch = '';
    this.selectedRazaId = null;
    this.formPet.raza = new Raza();

    this.dropdownOpen.especie = false;
  }

  selectRaza(raza: Raza | null): void {
    if (!raza) {
      this.errorMessage = 'No fue posible seleccionar la raza creada.';
      return;
    }

    if (raza.especie?.id) {
      this.selectedEspecieId = raza.especie.id;
      this.especieSearch = raza.especie.nombre ?? '';
      this.filterRazasByEspecie(raza.especie.id);
    }

    this.razaSearch = raza.nombre;
    this.selectedRazaId = raza.id ?? null;
    this.formPet.raza = raza;
    this.dropdownOpen.raza = false;
  }

  onRazaModalEspecieChange(especieId: number | null): void {
    this.selectedEspecieId = especieId;

    const especieSeleccionada = this.especies.find((e) => e.id === especieId);
    this.especieSearch = especieSeleccionada?.nombre ?? '';
    this.razaModalEspecieSearch = especieSeleccionada?.nombre ?? '';
    this.filterRazasByEspecie(especieId);

    if (
      this.addRazaError === 'Selecciona una especie antes de agregar la raza'
    ) {
      this.addRazaError = null;
    }
  }

  openRazaModalEspecieDropdown(): void {
    this.showRazaModalEspecieDropdown = true;
  }

  selectRazaModalEspecie(especie: Especie): void {
    this.onRazaModalEspecieChange(especie.id ?? null);
    this.showRazaModalEspecieDropdown = false;
  }

  selectEnfermedad(enfermedad: Enfermedad | null): void {
    if (!enfermedad) {
      this.errorMessage = 'No fue posible seleccionar la enfermedad creada.';
      return;
    }

    this.enfermedadSearch = enfermedad.nombre ?? '';
    this.selectedEnfermedadId = enfermedad.id ?? null;
    this.formPet.enfermedad = {
      id: enfermedad.id ?? null,
      nombre: enfermedad.nombre ?? '',
    } as any;
    this.dropdownOpen.enfermedad = false;
  }

  onTieneCitaChange(): void {
    this.citasError = null;
    this.selectedCitaId = null;
    this.citaSearch = '';
    this.citasSemana = [];
    this.dropdownOpen.cita = false;
    this.citasLoadedVetId = null;

    if (!this.tieneCita) {
      this.selectedVetId = null;
      this.vetSearch = '';
      this.dropdownOpen.vet = false;
      return;
    }

    if (this.isAdminView) {
      this.loadVetsForAdmin();
      return;
    }

    if (this.loggedVetId) {
      this.loadCitasSemana(this.loggedVetId);
      return;
    }

    this.loadLoggedVet();
  }

  selectVet(vet: Vet): void {
    this.vetSearch = vet.nombre;
    this.selectedVetId = vet.id ?? null;
    this.dropdownOpen.vet = false;

    this.selectedCitaId = null;
    this.citaSearch = '';
    this.citasSemana = [];
    this.citasLoadedVetId = null;

    if (this.selectedVetId) {
      this.loadCitasSemana(this.selectedVetId);
      return;
    }

    this.citasError = 'No fue posible seleccionar el veterinario.';
  }

  selectCita(cita: CitaDto): void {
    if (!cita.id) {
      this.citasError = 'No fue posible seleccionar la cita.';
      return;
    }

    this.selectedCitaId = cita.id;
    this.citaSearch = this.getCitaLabel(cita);
    this.dropdownOpen.cita = false;
    this.citasError = null;
  }

  onVetInputChange(): void {
    const vetValido = this.vets.some(
      (v) => v.id === this.selectedVetId && v.nombre === this.vetSearch,
    );

    if (vetValido) {
      return;
    }

    this.selectedVetId = null;
    this.selectedCitaId = null;
    this.citaSearch = '';
    this.citasSemana = [];
    this.citasLoadedVetId = null;
  }

  onCitaInputChange(): void {
    const citaValida = this.citasSemana.some(
      (cita) =>
        cita.id === this.selectedCitaId &&
        this.getCitaLabel(cita) === this.citaSearch,
    );

    if (!citaValida) {
      this.selectedCitaId = null;
    }
  }

  openCitasDropdown(): void {
    const vetId = this.resolveVetIdForCitas();

    if (!vetId) {
      if (!this.isAdminView) {
        this.openDropdown('cita');
        this.loadLoggedVet();
        return;
      }

      this.citasError =
        'Selecciona un veterinario antes de consultar las citas.';
      return;
    }

    this.openDropdown('cita');

    if (this.citasLoadedVetId !== vetId && !this.loadingCitas) {
      this.loadCitasSemana(vetId);
    }
  }

  /** Filtra razas según la especie seleccionada */
  filterRazasByEspecie(especieId: number | null): void {
    this.razasFiltradas = especieId
      ? this.razas.filter((r) => r.especie?.id === especieId)
      : [...this.razas];
  }

  getCitaLabel(cita: CitaDto): string {
    const tipo = cita.tipoCitaNombre ? ` - ${cita.tipoCitaNombre}` : '';

    return `${cita.diaSemana} ${cita.hora}${tipo}`;
  }

  private resolveVetIdForCitas(): number | null {
    return this.isAdminView ? this.selectedVetId : this.loggedVetId;
  }

  /** Limpia la especie y raza cuando el usuario borra el input de especie */
  onEspecieInputChange(): void {
    if (!this.especieSearch) {
      this.selectedEspecieId = null;
      this.razaSearch = '';
      this.selectedRazaId = null;
      this.filterRazasByEspecie(null);
    }
  }

  // ─── Modal: Agregar Raza ──────────────────────────────────────────────────────
  openAddRazaModal(): void {
    if (this.closeRazaModalTimeout) {
      clearTimeout(this.closeRazaModalTimeout);
      this.closeRazaModalTimeout = null;
    }

    this.newRazaNombre = this.razaSearch;
    this.razaModalEspecieSearch = this.especieSearch;
    this.addRazaError = null;
    this.addRazaSuccess = null;
    this.showAddRazaModal = true;
    this.isClosingAddRazaModal = false;
    this.showRazaModalEspecieDropdown = false;
    this.dropdownOpen.raza = false;
  }

  closeAddRazaModal(): void {
    if (!this.showAddRazaModal || this.isClosingAddRazaModal) {
      return;
    }

    if (this.closeRazaModalTimeout) {
      clearTimeout(this.closeRazaModalTimeout);
      this.closeRazaModalTimeout = null;
    }

    this.showRazaModalEspecieDropdown = false;
    this.isClosingAddRazaModal = true;

    this.closeRazaModalTimeout = setTimeout(() => {
      this.showAddRazaModal = false;
      this.isClosingAddRazaModal = false;
      this.addRazaError = null;
      this.addRazaSuccess = null;
      this.newRazaNombre = '';
      this.razaModalEspecieSearch = '';
      this.savingRaza = false;
    }, 150);
  }

  saveNewRaza(): void {
    if (!this.selectedEspecieId) {
      this.addRazaError = 'Selecciona una especie antes de agregar la raza';
      return;
    }
    if (!this.newRazaNombre.trim()) {
      this.addRazaError = 'Ingresa el nombre de la raza';
      return;
    }

    this.addRazaError = null;
    this.addRazaSuccess = null;
    this.savingRaza = true;

    const raza: Raza = new Raza(
      null,
      this.newRazaNombre.trim(),
      new Especie(this.selectedEspecieId, this.especieSearch.trim()),
    );

    this.razasService.addRaza(raza).subscribe({
      next: (razaCreada: Raza | null) => {
        const especieSeleccionada = this.especies.find(
          (e) => e.id === this.selectedEspecieId,
        );

        const especieRaza = razaCreada?.especie?.id
          ? razaCreada.especie
          : new Especie(
              this.selectedEspecieId ?? 0,
              especieSeleccionada?.nombre ?? this.especieSearch.trim(),
            );

        const razaPersistida: Raza = new Raza(
          razaCreada?.id ?? null,
          razaCreada?.nombre ?? raza.nombre,
          especieRaza,
        );

        this.razas = [...this.razas, razaPersistida];
        this.filterRazasByEspecie(this.selectedEspecieId);
        this.selectRaza(razaPersistida);

        this.addRazaError = null;
        this.addRazaSuccess = 'Raza agregada correctamente';
        this.savingRaza = false;

        this.closeRazaModalTimeout = setTimeout(() => {
          this.closeAddRazaModal();
        }, 600);
      },
      error: (err: unknown) => {
        this.addRazaError = this.getBackendErrorMessage(
          err,
          'Ocurrió un error al guardar la raza',
        );
        this.addRazaSuccess = null;
        this.savingRaza = false;
      },
    });
  }

  // ─── Modal: Agregar Enfermedad ────────────────────────────────────────────────
  openAddEnfermedadModal(): void {
    if (this.closeEnfermedadModalTimeout) {
      clearTimeout(this.closeEnfermedadModalTimeout);
      this.closeEnfermedadModalTimeout = null;
    }

    this.newEnfermedadNombre = this.enfermedadSearch;
    this.addEnfermedadError = null;
    this.addEnfermedadSuccess = null;
    this.showAddEnfermedadModal = true;
    this.isClosingAddEnfermedadModal = false;
    this.dropdownOpen.enfermedad = false;
  }

  closeAddEnfermedadModal(): void {
    if (!this.showAddEnfermedadModal || this.isClosingAddEnfermedadModal) {
      return;
    }

    if (this.closeEnfermedadModalTimeout) {
      clearTimeout(this.closeEnfermedadModalTimeout);
      this.closeEnfermedadModalTimeout = null;
    }

    this.isClosingAddEnfermedadModal = true;

    this.closeEnfermedadModalTimeout = setTimeout(() => {
      this.showAddEnfermedadModal = false;
      this.isClosingAddEnfermedadModal = false;
      this.addEnfermedadError = null;
      this.addEnfermedadSuccess = null;
      this.newEnfermedadNombre = '';
      this.savingEnfermedad = false;
    }, 150);
  }

  saveNewEnfermedad(): void {
    if (!this.newEnfermedadNombre.trim()) {
      this.addEnfermedadError = 'Ingresa el nombre de la enfermedad';
      return;
    }

    this.addEnfermedadError = null;
    this.savingEnfermedad = true;

    const enfermedad: Enfermedad = new Enfermedad(
      null,
      this.newEnfermedadNombre.trim(),
    );

    this.enfermedadesService.addEnfermedad(enfermedad).subscribe({
      next: (enfermedadCreada: Enfermedad | null) => {
        const enfermedadPersistida = new Enfermedad(
          enfermedadCreada?.id ?? null,
          enfermedadCreada?.nombre ?? enfermedad.nombre,
        );

        this.enfermedades = [...this.enfermedades, enfermedadPersistida];
        this.selectEnfermedad(enfermedadPersistida);
        this.addEnfermedadError = null;
        this.addEnfermedadSuccess = 'Enfermedad agregada correctamente';
        this.savingEnfermedad = false;

        this.closeEnfermedadModalTimeout = setTimeout(() => {
          this.closeAddEnfermedadModal();
        }, 600);
      },
      error: (err: unknown) => {
        this.addEnfermedadSuccess = null;
        this.addEnfermedadError = this.getBackendErrorMessage(
          err,
          'Ocurrió un error al guardar la enfermedad',
        );
        this.savingEnfermedad = false;
      },
    });
  }

  // ─── Guardar mascota ──────────────────────────────────────────────────────────
  savePet(): void {
    if (this.savingPet) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    if (!this.formPet.nombre?.trim()) {
      this.errorMessage = 'Nombre requerido';
      return;
    }
    if (!this.selectedClienteId || !this.existeCliente()) {
      this.errorMessage = 'Selecciona un dueño de la lista';
      return;
    }
    if (!this.selectedEspecieId || !this.existeEspecie()) {
      this.errorMessage = 'Selecciona una especie de la lista';
      return;
    }
    if (!this.selectedRazaId || !this.existeRaza()) {
      this.errorMessage = 'Selecciona una raza de la lista';
      return;
    }
    if (!this.selectedEnfermedadId || !this.existeEnfermedad()) {
      this.errorMessage = 'Selecciona una enfermedad de la lista';
      return;
    }
    if (!this.fechaNacimientoStr) {
      this.errorMessage = 'Fecha de nacimiento requerida';
      return;
    }
    if (!this.formPet.peso || this.formPet.peso <= 0) {
      this.errorMessage = 'El peso debe ser mayor a 0';
      return;
    }
    if (!this.formPet.urlFoto?.trim()) {
      this.errorMessage = 'URL de foto requerida';
      return;
    }
    if (this.tieneCita) {
      if (this.isAdminView && (!this.selectedVetId || !this.existeVet())) {
        this.errorMessage = 'Selecciona un veterinario de la lista';
        return;
      }

      if (!this.selectedCitaId || !this.existeCita()) {
        this.errorMessage = 'Selecciona una cita de la semana actual';
        return;
      }
    }

    this.savingPet = true;

    this.formPet.fechaNacimiento = new Date(this.fechaNacimientoStr);
    this.syncPetRelationsFromSelections();
    const citaId = this.tieneCita ? (this.selectedCitaId ?? 0) : 0;

    this.petService.savePet(this.formPet, citaId).subscribe({
      next: () => {
        this.savingPet = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.successMessage = this.petId
          ? 'Cambios guardados correctamente'
          : 'Mascota guardada correctamente';

        setTimeout(() => {
          this.router.navigateByUrl(`${this.basePath}/pets`);
        }, 600);
      },
      error: () => {
        this.savingPet = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.errorMessage = this.petId
          ? 'No fue posible guardar los cambios de la mascota.'
          : 'No fue posible guardar la mascota.';
      },
    });
  }

  private existeEspecie(): boolean {
    return this.especies.some(
      (e) => e.id === this.selectedEspecieId && e.nombre === this.especieSearch,
    );
  }

  private existeRaza(): boolean {
    return this.razas.some(
      (r) => r.id === this.selectedRazaId && r.nombre === this.razaSearch,
    );
  }

  private existeCliente(): boolean {
    return this.clientes.some(
      (c) => c.id === this.selectedClienteId && c.nombre === this.clienteSearch,
    );
  }

  private existeEnfermedad(): boolean {
    return this.enfermedades.some(
      (e) =>
        e.id === this.selectedEnfermedadId &&
        e.nombre === this.enfermedadSearch,
    );
  }

  private existeVet(): boolean {
    return this.vets.some(
      (v) => v.id === this.selectedVetId && v.nombre === this.vetSearch,
    );
  }

  private existeCita(): boolean {
    return this.citasSemana.some((cita) => cita.id === this.selectedCitaId);
  }

  private syncPetSelectionsFromDto(): void {
    if (!this.loadedPetDto) {
      return;
    }

    const pet = this.loadedPetDto;

    const clientMatch = this.clientes.find(
      (cliente) => cliente.nombre === pet.owner,
    );
    this.selectedClienteId = clientMatch?.id ?? null;
    if (clientMatch) {
      this.formPet.owner = clientMatch;
    }

    const especieMatch = this.especies.find(
      (especie) => especie.nombre === pet.especie,
    );
    this.selectedEspecieId = especieMatch?.id ?? null;

    if (this.selectedEspecieId) {
      this.filterRazasByEspecie(this.selectedEspecieId);
    }

    const razaMatch = this.razas.find((raza) => {
      const sameName = raza.nombre === pet.raza;
      const sameSpecies = pet.especie
        ? raza.especie?.nombre === pet.especie
        : true;
      return sameName && sameSpecies;
    });
    this.selectedRazaId = razaMatch?.id ?? null;
    if (razaMatch) {
      this.formPet.raza = razaMatch;
      this.selectedEspecieId = razaMatch.especie?.id ?? this.selectedEspecieId;
      this.filterRazasByEspecie(this.selectedEspecieId);
    }

    const enfermedadMatch = this.enfermedades.find(
      (enfermedad) => enfermedad.nombre === pet.enfermedad,
    );
    this.selectedEnfermedadId = enfermedadMatch?.id ?? null;
    if (enfermedadMatch) {
      this.formPet.enfermedad = enfermedadMatch;
    }
  }

  private syncPetRelationsFromSelections(): void {
    const cliente = this.clientes.find((c) => c.id === this.selectedClienteId);
    const raza = this.razas.find((r) => r.id === this.selectedRazaId);
    const enfermedad = this.enfermedades.find(
      (e) => e.id === this.selectedEnfermedadId,
    );

    if (cliente) {
      this.formPet.owner = cliente;
    }
    if (raza) {
      this.formPet.raza = raza;
    }
    if (enfermedad) {
      this.formPet.enfermedad = enfermedad;
    }
  }

  private applyPetDtoToForm(pet: PetDTO): void {
    this.fechaNacimientoStr = this.getApproxBirthDate(pet.edad);

    this.formPet = new Pet(
      pet.id ?? this.petId ?? undefined,
      pet.nombre ?? '',
      pet.estado ?? true,
      new Date(this.fechaNacimientoStr),
      pet.peso ?? null,
      pet.urlFoto ?? '',
    );

    // Sincroniza los search inputs con los valores cargados
    this.clienteSearch = pet.owner ?? '';
    this.especieSearch = pet.especie ?? '';
    this.razaSearch = pet.raza ?? '';
    this.enfermedadSearch = pet.enfermedad ?? '';

    this.syncPetSelectionsFromDto();
  }

  private getApproxBirthDate(edad: number | null | undefined): string {
    const edadValue =
      typeof edad === 'number' && Number.isFinite(edad) ? edad : 0;
    const date = new Date();
    date.setFullYear(date.getFullYear() - edadValue);
    return date.toISOString().split('T')[0];
  }

  private getBackendErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;

      if (typeof body === 'string' && body.trim()) {
        return body;
      }

      const message =
        body?.detalle ||
        body?.detail ||
        body?.message ||
        body?.mensaje ||
        body?.error ||
        err.message;

      return message || fallback;
    }

    return err instanceof Error ? err.message : fallback;
  }
}
