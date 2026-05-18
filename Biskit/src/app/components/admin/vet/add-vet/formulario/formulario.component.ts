import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { VetService } from '../../../../../services/vet.service';
import { Router } from '@angular/router';
import { Vet } from '../../../../../models/Vets/vet-cl';
import { AddEspecialidadComponent } from '../add-especialidad/add-especialidad.component';
import { Especialidad } from '../../../../../models/Vets/Especialidad/especialidad';
import { EspecialidadesService } from '../../../../../services/especialidades.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule, CommonModule, AddEspecialidadComponent],
  templateUrl: './formulario.component.html',
  animations: [dropdownAnimation()],
})
export class FormularioComponent {
  @Input() vetId: number | null = null;

  @Input() returnRoute: string | Array<string | number> = ['/admin'];

  constructor(
    private vetService: VetService,
    private router: Router,
    private especialidadesService: EspecialidadesService,
    private elRef: ElementRef,
  ) {}

  formVet: Vet = new Vet();
  especialidades: Especialidad[] = [];

  especialidadSearch = '';
  dropdownVisible = false;
  estadoDropdownVisible = false;
  showAddModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading = false;

  ngOnInit(): void {
    if (this.vetId) {
      this.vetService.findById(this.vetId).subscribe({
        next: (vet) => {
          this.formVet = vet;
          this.especialidadSearch = vet.especialidad.nombre;
        },
        error: () => {
          this.formVet = new Vet();
        },
      });
      this.especialidadSearch = this.formVet.especialidad.nombre;
    }

    this.especialidadesService.findAll().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades;
      },
      error: () => {
        this.especialidades = [];
      },
    });
  }

  get filteredEspecialidades(): Especialidad[] {
    const q = this.especialidadSearch.trim().toLowerCase();
    if (!q) return this.especialidades;
    return this.especialidades.filter((e) =>
      e.nombre.toLowerCase().includes(q),
    );
  }

  // ── Dropdown ──────────────────────────────────────────────

  openDropdown(): void {
    this.estadoDropdownVisible = false;
    this.dropdownVisible = true;
  }

  onSearchInput(): void {
    this.estadoDropdownVisible = false;
    this.dropdownVisible = true;
    // Si el usuario borró el texto, limpiar la selección
    if (!this.especialidadSearch.trim()) {
      this.formVet.especialidad = { nombre: '' };
    }
  }

  selectEspecialidad(esp: Especialidad): void {
    this.formVet.especialidad = esp;
    this.especialidadSearch = esp.nombre;
    this.dropdownVisible = false;
  }

  openEstadoDropdown(): void {
    this.dropdownVisible = false;
    this.estadoDropdownVisible = true;
  }

  selectEstado(estado: boolean): void {
    this.formVet.estado = estado;
    this.estadoDropdownVisible = false;
  }

  get estadoLabel(): string {
    return this.formVet.estado ? 'Activo' : 'Inactivo';
  }

  /** Cierra el dropdown al hacer clic fuera del componente. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
      this.estadoDropdownVisible = false;
    }
  }

  // ── Modal agregar especialidad ────────────────────────────

  openAddModal(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.dropdownVisible = false;
    this.estadoDropdownVisible = false;
    this.showAddModal = true;
  }

  onEspecialidadCreated(esp: Especialidad): void {
    this.especialidades = [...this.especialidades, esp];
    this.selectEspecialidad(esp);
    this.errorMessage = null;
  }

  // ── Guardar Veterinario ──────────────────────────────────────────────

  saveVet(): void {
    if (this.loading) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    if (!this.formVet.nombre.trim()) {
      this.errorMessage = 'Nombre requerido';
      return;
    }
    if (!this.formVet.correo.trim()) {
      this.errorMessage = 'Correo requerido';
      return;
    }
    if (!this.formVet.cedula.trim()) {
      this.errorMessage = 'Cédula requerida';
      return;
    }
    if (!this.formVet.urlFoto.trim()) {
      this.errorMessage = 'URL de foto requerida';
      return;
    }
    if (!this.formVet.especialidad) {
      this.errorMessage = 'Especialidad requerida';
      return;
    }

    this.loading = true;

    this.vetService.saveVet(this.formVet).subscribe({
      next: () => {
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'auto' });

        this.vetId
          ? (this.successMessage = 'Cambios guardados correctamente')
          : (this.successMessage = 'Veterinario guardado correctamente');
        setTimeout(() => {
          this.router.navigate(
            Array.isArray(this.returnRoute)
              ? this.returnRoute
              : [this.returnRoute],
          );
        }, 600);

        this.formVet = new Vet(); //Resetear el formulario
        this.especialidadSearch = '';
        return;
      },
      error: () => {
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        this.errorMessage = this.vetId
          ? 'No fue posible guardar los cambios del veterinario.'
          : 'No fue posible guardar el veterinario.';
      },
    });
  }
}

// CÓDIGO DE ANIMACIONES
function dropdownAnimation() {
  return trigger('dropdownAnim', [
    state(
      'void',
      style({ opacity: 0, transform: 'translateY(-4px) scale(0.95)' }),
    ),
    state('*', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
    transition(':enter', animate('150ms ease-out')),
    transition(':leave', animate('150ms ease-in')),
  ]);
}
