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
import { VetService } from '../../../../services/vet.service';
import { Router } from '@angular/router';
import { VetCl } from '../../../../modelo/Vets/vet-cl';
import { AddEspecialidadComponent } from '../add-especialidad/add-especialidad.component';
import { Especialidad } from '../../../../modelo/Vets/Especialidad/especialidad';
import { EspecialidadesService } from '../../../../services/especialidades.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [FormsModule, CommonModule, AddEspecialidadComponent],
  templateUrl: './formulario.component.html',
  animations: [
    trigger('dropdownAnim', [
      state(
        'void',
        style({ opacity: 0, transform: 'translateY(-4px) scale(0.95)' }),
      ),
      state('*', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      transition(':enter', animate('150ms ease-out')),
      transition(':leave', animate('150ms ease-in')),
    ]),
  ],
})
export class FormularioComponent {
  @Input() vetId: number | null = null;

  constructor(
    private vetService: VetService,
    private router: Router,
    private especialidadesService: EspecialidadesService,
    private elRef: ElementRef,
  ) {}

  formVet: VetCl = new VetCl();
  especialidades: Especialidad[] = [];

  especialidadSearch = '';
  dropdownVisible = false;
  showAddModal = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit(): void {
    if (this.vetId) {
      this.formVet = this.vetService.findById(this.vetId);
      this.especialidadSearch = this.formVet.especialidad.nombre;
    }
    this.especialidades = this.especialidadesService.getAll();
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
    this.dropdownVisible = true;
  }

  onSearchInput(): void {
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

  /** Cierra el dropdown al hacer clic fuera del componente. */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  // ── Modal agregar especialidad ────────────────────────────

  openAddModal(): void {
    this.dropdownVisible = false;
    this.showAddModal = true;
  }

  onEspecialidadCreated(esp: Especialidad): void {
    // Añadir a la lista local y seleccionarla automáticamente
    this.selectEspecialidad(esp);
    this.showAddModal = false;
  }

  // ── Guardar Veterinario ──────────────────────────────────────────────

  saveVet(): void {
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

    this.vetService.saveVet(this.formVet);

    if (this.vetId) {
      this.router.navigate(['']);
    } else {
      this.successMessage = 'Veterinario guardado correctamente';
      this.formVet = new VetCl(); //Resetear el formulario
    }
  }
}
