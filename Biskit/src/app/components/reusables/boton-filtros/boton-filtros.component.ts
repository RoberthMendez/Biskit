import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { FiltrosService } from '../../../services/filtros.service';
import { FiltrosPetsDto } from '../../../models/dtos/filtros-pets-dto';
import { FiltrosVetsDto } from '../../../models/dtos/filtros-vets-dto';
import { EspeciesService } from '../../../services/especies.service';
import { RazasService } from '../../../services/razas.service';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { EnfermedadesService } from '../../../services/enfermedades.service';
import { PetService } from '../../../services/pet.service';
import { PetDTO } from '../../../models/dtos/pet-dto';
import { Vet } from '../../../models/Vets/vet-cl';
import { FiltrosEstadoService } from '../../../services/filtros-estado.service';

@Component({
  selector: 'app-boton-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boton-filtros.component.html',
  styleUrls: ['./boton-filtros.component.css'],
})
export class BotonFiltrosComponent implements OnInit {
  @Input() tipo: 'pets' | 'vets' = 'pets';
  @Input() isAdminView: boolean = false;
  @Input() vetId?: number;
  @Output() filtrosAplicados = new EventEmitter<PetDTO[] | Vet[]>();

  showModal = false;
  isLoading = false;

  // Opciones disponibles
  especies: any[] = [];
  todasLasRazas: any[] = [];
  razasFiltradas: any[] = [];
  especialidades: any[] = [];
  enfermedades: any[] = [];
  mascotas: PetDTO[] = [];

  // Estados de búsqueda y filtrado para dropdowns
  especieSearch = '';
  razaSearch = '';
  enfermedadSearch = '';
  especialidadSearch = '';
  mascotaSearch = '';
  estadoPetSearch = '';
  estadoVetSearch = '';

  especiesFiltradas: any[] = [];
  enfermedadesFiltradas: any[] = [];
  especialidadesFiltradas: any[] = [];
  mascotasFiltradas: any[] = [];

  // Control de dropdowns abiertos
  dropdownOpen: { [key: string]: boolean } = {
    especie: false,
    raza: false,
    enfermedad: false,
    especieVets: false,
    especialidad: false,
    estadoPet: false,
    estadoVet: false,
    mascota: false,
  };

  // Estilos en línea para posicionar dropdowns con `position: fixed`
  dropdownStyles: { [key: string]: any } = {};

  // Filtros Pets
  filtrosPets: FiltrosPetsDto = {};
  mostrarMisMascotas: boolean = false;

  // Filtros Vets
  filtrosVets: FiltrosVetsDto = {};

  // Estado del botón (si hay filtros activos)
  tieneFilterActivos = false;
  private restaurado = false;

  constructor(
    private filtrosService: FiltrosService,
    private especiesService: EspeciesService,
    private razasService: RazasService,
    private especialidadesService: EspecialidadesService,
    private enfermedadesService: EnfermedadesService,
    private petService: PetService,
    private filtrosEstadoService: FiltrosEstadoService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit() {
    this.cargarOpciones();
  }

  private cargarOpciones() {
    if (this.tipo === 'pets') {
      forkJoin({
        especies: this.especiesService.findAll(),
        razas: this.razasService.findAll(),
        enfermedades: this.enfermedadesService.findAll(),
      }).subscribe(({ especies, razas, enfermedades }) => {
        this.especies = especies;
        this.todasLasRazas = razas;
        this.enfermedades = enfermedades;
        this.restaurarFiltrosSiExisten();
      });
    } else {
      forkJoin({
        especialidades: this.especialidadesService.findAll(),
        mascotas: this.petService.findAll(),
      }).subscribe(({ especialidades, mascotas }) => {
        this.especialidades = especialidades;
        this.mascotas = mascotas;
        this.restaurarFiltrosSiExisten();
      });
    }
  }

  private restaurarFiltrosSiExisten(): void {
    if (this.restaurado) {
      return;
    }

    const filtrosGuardados = this.filtrosEstadoService.obtener<{
      filtrosPets?: FiltrosPetsDto;
      mostrarMisMascotas?: boolean;
      filtrosVets?: FiltrosVetsDto;
    }>(this.getStorageKey());

    if (!filtrosGuardados) {
      return;
    }

    this.restaurado = true;

    if (this.tipo === 'pets' && filtrosGuardados.filtrosPets) {
      this.filtrosPets = { ...filtrosGuardados.filtrosPets };
      this.mostrarMisMascotas = Boolean(filtrosGuardados.mostrarMisMascotas);
      this.estadoPetSearch = this.getEstadoLabel(this.filtrosPets.estado);
      this.especieSearch = this.filtrosPets.especie || '';
      this.razaSearch = this.filtrosPets.raza || '';
      this.enfermedadSearch = this.filtrosPets.enfermedad || '';
      if (this.especieSearch) {
        this.onEspecieSearchChange();
      }
      if (this.enfermedadSearch) {
        this.onEnfermedadSearchChange();
      }
      if (this.filtrosPets.especie) {
        this.onEspecieChange();
      }
      this.aplicarFiltros(false);
      return;
    }

    if (this.tipo === 'vets' && filtrosGuardados.filtrosVets) {
      this.filtrosVets = { ...filtrosGuardados.filtrosVets };
      this.estadoVetSearch = this.getEstadoLabel(this.filtrosVets.estado);
      this.especialidadSearch = this.filtrosVets.especialidad || '';
      this.mascotaSearch = this.getMascotaLabel(this.filtrosVets.pet);
      if (this.especialidadSearch) {
        this.onEspecialidadSearchChange();
      }
      if (this.mascotaSearch) {
        this.onMascotaSearchChange();
      }
      this.aplicarFiltros(false);
    }
  }

  private getEstadoLabel(estado?: boolean): string {
    if (estado === true) {
      return 'Activas';
    }

    if (estado === false) {
      return 'Inactivas';
    }

    return '';
  }

  private getMascotaLabel(petId?: string | null): string {
    if (!petId || petId === '') {
      return '';
    }

    // En selectMascota se guarda el nombre, así que buscamos por nombre
    const mascota = this.mascotas.find((m) => m.nombre === petId);
    return mascota ? mascota.nombre : petId;
  }

  private getStorageKey(): string {
    return `boton-filtros:${this.tipo}`;
  }

  onEspecieChange() {
    if (this.filtrosPets.especie) {
      // Filtrar razas por especie seleccionada
      this.razasFiltradas = this.todasLasRazas.filter(
        (raza: any) => raza.especie?.nombre === this.filtrosPets.especie,
      );

      if (
        this.filtrosPets.raza &&
        !this.razasFiltradas.some(
          (raza: any) => raza.nombre === this.filtrosPets.raza,
        )
      ) {
        this.filtrosPets.raza = undefined;
      }
    } else {
      this.razasFiltradas = [];
      this.filtrosPets.raza = undefined;
    }
  }

  abrirModal() {
    this.showModal = true;
    this.cerrarTodosLosDropdowns();
  }

  cerrarModal() {
    this.showModal = false;
    this.cerrarTodosLosDropdowns();
  }

  cerrarTodosLosDropdowns() {
    Object.keys(this.dropdownOpen).forEach((key) => {
      this.dropdownOpen[key] = false;
    });
    this.dropdownStyles = {};
  }

  limpiarFiltros() {
    if (this.tipo === 'pets') {
      this.filtrosPets = {};
      this.mostrarMisMascotas = false;
      this.razasFiltradas = [];
      this.especieSearch = '';
      this.razaSearch = '';
      this.enfermedadSearch = '';
      this.estadoPetSearch = '';
      this.especiesFiltradas = [];
      this.enfermedadesFiltradas = [];
    } else {
      this.filtrosVets = {};
      this.especialidadSearch = '';
      this.mascotaSearch = '';
      this.estadoVetSearch = '';
      this.especialidadesFiltradas = [];
      this.mascotasFiltradas = [];
    }
    this.cerrarTodosLosDropdowns();
    this.tieneFilterActivos = false;
    this.filtrosEstadoService.eliminar(this.getStorageKey());
    this.aplicarFiltros(false);
  }

  // Reset filters state without emitting filtrosAplicados (used by parent to clear filters centrally)
  resetWithoutEmit(): void {
    if (this.tipo === 'pets') {
      this.filtrosPets = {};
      this.mostrarMisMascotas = false;
      this.razasFiltradas = [];
      this.especieSearch = '';
      this.razaSearch = '';
      this.enfermedadSearch = '';
      this.estadoPetSearch = '';
      this.especiesFiltradas = [];
      this.enfermedadesFiltradas = [];
    } else {
      this.filtrosVets = {};
      this.especialidadSearch = '';
      this.mascotaSearch = '';
      this.estadoVetSearch = '';
      this.especialidadesFiltradas = [];
      this.mascotasFiltradas = [];
    }
    this.cerrarTodosLosDropdowns();
    this.tieneFilterActivos = false;
    this.filtrosEstadoService.eliminar(this.getStorageKey());
  }

  aplicarFiltros(guardarEstado = true) {
    this.isLoading = true;

    this.normalizarFiltros();

    if (this.tipo === 'pets') {
      this.filtrosService
        .getPetsFiltrados(this.filtrosPets, this.mostrarMisMascotas, this.vetId)
        .subscribe({
          next: (pets) => {
            this.tieneFilterActivos = this.verificarFiltrosActivos();
            if (guardarEstado) {
              this.filtrosEstadoService.guardar(this.getStorageKey(), {
                filtrosPets: this.filtrosPets,
                mostrarMisMascotas: this.mostrarMisMascotas,
              });
            }
            this.filtrosAplicados.emit(pets);
            this.isLoading = false;
            this.cerrarModal();
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.filtrosService.getVetsFiltrados(this.filtrosVets).subscribe({
        next: (vets: any) => {
          this.tieneFilterActivos = this.verificarFiltrosActivos();
          if (guardarEstado) {
            this.filtrosEstadoService.guardar(this.getStorageKey(), {
              filtrosVets: this.filtrosVets,
            });
          }
          this.filtrosAplicados.emit(vets);
          this.isLoading = false;
          this.cerrarModal();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  private normalizarFiltros(): void {
    if (this.tipo === 'pets') {
      this.filtrosPets = {
        ...this.filtrosPets,
        edad: this.normalizarNumero(this.filtrosPets.edad),
        peso: this.normalizarNumero(this.filtrosPets.peso),
        tratamientos: this.normalizarNumero(this.filtrosPets.tratamientos),
      };

      if (!this.filtrosPets.especie) {
        this.filtrosPets.raza = undefined;
      }
    } else {
      this.filtrosVets = {
        ...this.filtrosVets,
        tratamientos: this.normalizarNumero(this.filtrosVets.tratamientos),
      };
    }
  }

  private normalizarNumero(valor?: number | string | null): number | undefined {
    if (valor === undefined || valor === null || valor === '') {
      return undefined;
    }

    const numero = Number(valor);
    return Number.isNaN(numero) ? undefined : numero;
  }

  private verificarFiltrosActivos(): boolean {
    if (this.tipo === 'pets') {
      return (
        Object.values(this.filtrosPets).some(
          (v) => v !== undefined && v !== null && v !== '',
        ) || this.mostrarMisMascotas
      );
    } else {
      return Object.values(this.filtrosVets).some(
        (v) => v !== undefined && v !== null && v !== '',
      );
    }
  }

  // Métodos para controlar dropdowns
  toggleDropdown(key: string) {
    if (this.dropdownOpen[key]) {
      this.closeDropdown(key);
      return;
    }
    this.openDropdown(key);
  }

  openDropdown(key: string) {
    this.cerrarTodosLosDropdowns();
    // calcular posición del trigger y fijar el dropdown en la ventana (fixed)
    const dropdownWrapper = this.elementRef.nativeElement.querySelector(
      `[data-dropdown="${key}"]`,
    );
    if (dropdownWrapper) {
      const triggerEl =
        dropdownWrapper.querySelector('input') ||
        dropdownWrapper.querySelector('div');
      if (triggerEl && triggerEl.getBoundingClientRect) {
        const rect = triggerEl.getBoundingClientRect();
        const maxHeight = 240; // 15rem en pixels (1rem = 16px * 15 = 240px)
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Decidir si posicionar arriba o abajo
        const posicionAriba = spaceBelow < maxHeight && spaceAbove > maxHeight;

        // dejar 6px de separación
        const styles: any = {
          position: 'fixed',
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          'max-height': '15rem',
          'overflow-y': 'auto',
        };

        if (posicionAriba) {
          // Posicionar arriba
          styles.bottom = `${window.innerHeight - rect.top + 6}px`;
        } else {
          // Posicionar abajo (por defecto)
          styles.top = `${rect.bottom + 6}px`;
        }

        this.dropdownStyles[key] = styles;
      }
    }
    this.dropdownOpen[key] = true;
  }

  closeDropdown(key: string) {
    this.dropdownOpen[key] = false;
    if (this.dropdownStyles[key]) {
      delete this.dropdownStyles[key];
    }
  }

  /** Detecta clicks (mousedown) fuera del modal o fuera del dropdown activo y cierra dropdowns correctamente */
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!this.showModal || !target) {
      return;
    }

    // Si el click fue fuera del modal cerramos modal y dropdowns
    if (!this.elementRef.nativeElement.contains(target)) {
      this.cerrarModal();
      return;
    }

    // Si el click fue dentro del modal, pero fuera del dropdown activo, cerramos dropdowns
    const openKey = Object.keys(this.dropdownOpen).find(
      (k) => this.dropdownOpen[k],
    );
    if (!openKey) {
      return;
    }

    const dropdownWrapper = this.elementRef.nativeElement.querySelector(
      `[data-dropdown="${openKey}"]`,
    ) as HTMLElement | null;
    const dropdownContent = this.elementRef.nativeElement.querySelector(
      `[data-dropdown-content="${openKey}"]`,
    ) as HTMLElement | null;
    if (!dropdownWrapper && !dropdownContent) {
      this.cerrarTodosLosDropdowns();
      return;
    }

    const clickedInsideWrapper = dropdownWrapper
      ? dropdownWrapper.contains(target)
      : false;
    const clickedInsideContent = dropdownContent
      ? dropdownContent.contains(target)
      : false;
    if (!clickedInsideWrapper && !clickedInsideContent) {
      this.cerrarTodosLosDropdowns();
    }
  }

  // Métodos de búsqueda y filtrado para PETS
  onEspecieSearchChange() {
    if (!this.especieSearch.trim()) {
      this.filtrosPets.especie = undefined;
      this.filtrosPets.raza = undefined;
      this.razasFiltradas = [];
    }
    this.especiesFiltradas = this.especies.filter((e) =>
      e.nombre.toLowerCase().includes(this.especieSearch.toLowerCase()),
    );
  }

  selectEspeciePet(especie: any) {
    this.filtrosPets.especie = especie.nombre;
    this.especieSearch = especie.nombre;
    this.closeDropdown('especie');
    this.onEspecieChange(); // Filtrar razas
  }

  onRazaSearchChange() {
    if (!this.razaSearch.trim()) {
      this.filtrosPets.raza = undefined;
    }
    this.razasFiltradas = this.todasLasRazas.filter(
      (r) =>
        r.especie?.nombre === this.filtrosPets.especie &&
        r.nombre.toLowerCase().includes(this.razaSearch.toLowerCase()),
    );
  }

  selectRazaPet(raza: any) {
    this.filtrosPets.raza = raza.nombre;
    this.razaSearch = raza.nombre;
    this.closeDropdown('raza');
  }

  onEnfermedadSearchChange() {
    if (!this.enfermedadSearch.trim()) {
      this.filtrosPets.enfermedad = undefined;
    }
    this.enfermedadesFiltradas = this.enfermedades.filter((e) =>
      e.nombre.toLowerCase().includes(this.enfermedadSearch.toLowerCase()),
    );
  }

  selectEnfermedad(enfermedad: any) {
    this.filtrosPets.enfermedad = enfermedad.nombre;
    this.enfermedadSearch = enfermedad.nombre;
    this.closeDropdown('enfermedad');
  }

  selectEstadoPet(estado: boolean | undefined) {
    this.filtrosPets.estado = estado;
    this.estadoPetSearch = this.getEstadoLabel(estado);
    this.closeDropdown('estadoPet');
  }

  onEstadoPetSearchChange() {
    if (!this.estadoPetSearch.trim()) {
      this.filtrosPets.estado = undefined;
    }
  }

  // Métodos de búsqueda y filtrado para VETS
  onEspecialidadSearchChange() {
    if (!this.especialidadSearch.trim()) {
      this.filtrosVets.especialidad = undefined;
    }
    this.especialidadesFiltradas = this.especialidades.filter((e) =>
      e.nombre.toLowerCase().includes(this.especialidadSearch.toLowerCase()),
    );
  }

  selectEspecialidad(especialidad: any) {
    this.filtrosVets.especialidad = especialidad.nombre;
    this.especialidadSearch = especialidad.nombre;
    this.closeDropdown('especialidad');
  }

  selectEstadoVet(estado: boolean | undefined) {
    this.filtrosVets.estado = estado;
    this.estadoVetSearch = this.getEstadoLabel(estado);
    this.closeDropdown('estadoVet');
  }

  onEstadoVetSearchChange() {
    if (!this.estadoVetSearch.trim()) {
      this.filtrosVets.estado = undefined;
    }
  }

  onMascotaSearchChange() {
    if (!this.mascotaSearch.trim()) {
      this.filtrosVets.pet = undefined;
    }
    this.mascotasFiltradas = this.mascotas.filter((m) =>
      m.nombre.toLowerCase().includes(this.mascotaSearch.toLowerCase()),
    );
  }

  selectMascota(mascota: any) {
    this.filtrosVets.pet = mascota.nombre;
    this.mascotaSearch = mascota.nombre;
    this.closeDropdown('mascota');
  }
}
