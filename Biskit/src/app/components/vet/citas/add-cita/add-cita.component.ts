import {
  Component,
  EventEmitter,
  ChangeDetectorRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { CitasService } from '../../../../services/citas.service';
import { CitaDto } from '../../../../models/dtos/cita-dto';
import { TipoCita } from '../../../../models/Citas/tipo-cita';
import { PetDTO } from '../../../../models/dtos/pet-dto';

export interface SlotCitaSeleccionado {
  diaSemana: string;
  hora: string;
  numSemana: number;
  fecha?: string;
}

type DropdownKey = 'tipo' | 'mascota';

@Component({
  selector: 'app-add-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-cita.component.html',
})
export class AddCitaComponent implements OnChanges, OnDestroy {
  @Input() slot: SlotCitaSeleccionado | null = null;
  @Input() vetId: number | null = null;
  @Input() tiposCita: TipoCita[] = [];
  @Input() mascotas: PetDTO[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() citaCreada = new EventEmitter<void>();

  tipoSearchText = '';
  mascotaSearchText = '';
  selectedTipo: TipoCita | null = null;
  selectedMascota: PetDTO | null = null;

  dropdownOpen: Record<DropdownKey, boolean> = {
    tipo: false,
    mascota: false,
  };

  guardando = false;
  errorMessage = '';
  successMessage = '';
  creacionExitosa = false;
  private successTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private citasService: CitasService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slot']) {
      this.limpiarFormulario();
    }
  }

  ngOnDestroy(): void {
    this.clearSuccessTimeout();
  }

  get tiposFiltrados(): TipoCita[] {
    const q = this.normalizar(this.tipoSearchText);

    if (!q) {
      return this.tiposCita;
    }

    return this.tiposCita.filter((tipo) =>
      this.normalizar(tipo.nombre).includes(q),
    );
  }

  get mascotasFiltradas(): PetDTO[] {
    const q = this.normalizar(this.mascotaSearchText);

    if (!q) {
      return this.mascotas;
    }

    return this.mascotas.filter((mascota) =>
      [mascota.nombre, mascota.owner, mascota.especie, mascota.raza].some(
        (valor) => this.normalizar(valor ?? '').includes(q),
      ),
    );
  }

  get puedeGuardar(): boolean {
    return Boolean(
      this.slot &&
      this.vetId &&
      this.selectedTipo &&
      this.selectedMascota?.id &&
      !this.guardando &&
      this.tiposCita.length > 0 &&
      this.mascotas.length > 0 &&
      !this.creacionExitosa,
    );
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.guardando && !this.creacionExitosa) {
      this.cerrarModal();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (!target?.closest('[data-cita-dropdown]')) {
      this.cerrarDropdowns();
    }
  }

  abrirDropdown(key: DropdownKey): void {
    (Object.keys(this.dropdownOpen) as DropdownKey[]).forEach(
      (dropdownKey) => (this.dropdownOpen[dropdownKey] = dropdownKey === key),
    );
  }

  cerrarDropdowns(): void {
    (Object.keys(this.dropdownOpen) as DropdownKey[]).forEach(
      (dropdownKey) => (this.dropdownOpen[dropdownKey] = false),
    );
  }

  seleccionarTipo(tipo: TipoCita): void {
    this.selectedTipo = tipo;
    this.tipoSearchText = tipo.nombre;
    this.dropdownOpen.tipo = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  seleccionarMascota(mascota: PetDTO): void {
    this.selectedMascota = mascota;
    this.mascotaSearchText = mascota.nombre;
    this.dropdownOpen.mascota = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onTipoInputChange(): void {
    if (this.selectedTipo?.nombre !== this.tipoSearchText) {
      this.selectedTipo = null;
    }
  }

  onMascotaInputChange(): void {
    if (this.selectedMascota?.nombre !== this.mascotaSearchText) {
      this.selectedMascota = null;
    }
  }

  guardarCita(): void {
    if (
      this.guardando ||
      this.creacionExitosa ||
      this.tiposCita.length === 0 ||
      this.mascotas.length === 0
    ) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.cerrarDropdowns();

    if (!this.slot) {
      this.errorMessage = 'Selecciona un horario en el calendario.';
      return;
    }

    if (!this.vetId) {
      this.errorMessage = 'No fue posible identificar el veterinario.';
      return;
    }

    if (!this.selectedTipo) {
      this.errorMessage = 'Selecciona un tipo de cita valido.';
      return;
    }

    if (!this.selectedMascota?.id) {
      this.errorMessage = 'Selecciona una mascota valida.';
      return;
    }

    const citaDto: CitaDto = {
      id: null,
      diaSemana: this.slot.diaSemana,
      hora: this.slot.hora,
      tipoCitaNombre: this.selectedTipo.nombre,
      duracionMinutos: this.selectedTipo.duracionMinutos,
      petId: this.selectedMascota.id,
      vetId: this.vetId,
    };

    this.guardando = true;
    this.citasService.crearCita(citaDto, this.slot.numSemana).subscribe({
      next: () => {
        this.guardando = false;
        this.creacionExitosa = true;
        this.cerrarDropdowns();
        this.successMessage = 'Cita creada correctamente';
        this.cdr.detectChanges();
        this.successTimeout = setTimeout(() => {
          this.citaCreada.emit();
        }, 600);
      },
      error: (error: HttpErrorResponse) => {
        this.guardando = false;
        this.cerrarDropdowns();
        this.successMessage = '';
        this.errorMessage = this.manejarError(error);
        this.cdr.detectChanges();
      },
    });
  }

  cerrarModal(): void {
    if (this.guardando || this.creacionExitosa) {
      return;
    }

    this.cerrar.emit();
  }

  private limpiarFormulario(): void {
    this.tipoSearchText = '';
    this.mascotaSearchText = '';
    this.selectedTipo = null;
    this.selectedMascota = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.creacionExitosa = false;
    this.clearSuccessTimeout();
    this.cerrarDropdowns();
  }

  private manejarError(error: HttpErrorResponse): string {
    const backendMessage = this.getBackendErrorMessage(error);

    if (backendMessage) {
      if (backendMessage.includes('ocupado en el horario solicitado')) {
        return backendMessage;
      }

      if (
        error.status === 400 ||
        error.status === 409 ||
        error.status === 500
      ) {
        return backendMessage;
      }
    }

    if (error.status === 400) {
      return 'El veterinario se encuentra ocupado en el horario solicitado.';
    }

    if (error.status === 409) {
      return 'Ese horario ya no esta disponible.';
    }

    if (error.status === 500) {
      return 'Ocurrio un error interno en el servidor.';
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    return 'No fue posible crear la cita.';
  }

  private getBackendErrorMessage(error: HttpErrorResponse): string {
    const body = error.error;

    if (typeof body === 'string' && body.trim()) {
      return body.trim();
    }

    const message =
      body?.detalle ||
      body?.detail ||
      body?.message ||
      body?.mensaje ||
      body?.error;

    return typeof message === 'string' ? message.trim() : '';
  }

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private clearSuccessTimeout(): void {
    if (!this.successTimeout) {
      return;
    }

    clearTimeout(this.successTimeout);
    this.successTimeout = null;
  }
}
