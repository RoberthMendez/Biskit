import { Component, Input, Output, EventEmitter, OnInit, HostListener, ElementRef } from '@angular/core';
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
import { Pet } from '../../../models/Pets/pet';
import { Vet } from '../../../models/Vets/vet-cl';
import { FiltrosEstadoService } from '../../../services/filtros-estado.service';

@Component({
  selector: 'app-boton-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boton-filtros.component.html',
  styleUrls: ['./boton-filtros.component.css']
})
export class BotonFiltrosComponent implements OnInit {

  @Input() tipo: 'pets' | 'vets' = 'pets';
  @Input() isAdminView: boolean = false;
  @Output() filtrosAplicados = new EventEmitter<Pet[] | Vet[]>();
  
  showModal = false;
  isLoading = false;
  
  // Opciones disponibles
  especies: any[] = [];
  todasLasRazas: any[] = [];
  razasFiltradas: any[] = [];
  especialidades: any[] = [];
  enfermedades: any[] = [];
  mascotas: any[] = [];
  
  // Estados de búsqueda y filtrado para dropdowns
  especieSearch = '';
  razaSearch = '';
  enfermedadSearch = '';
  especialidadSearch = '';
  mascotaSearch = '';
  
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
    mascota: false
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
    private elementRef: ElementRef
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
      if (this.filtrosPets.especie) {
        this.onEspecieChange();
      }
      this.aplicarFiltros(false);
      return;
    }

    if (this.tipo === 'vets' && filtrosGuardados.filtrosVets) {
      this.filtrosVets = { ...filtrosGuardados.filtrosVets };
      this.aplicarFiltros(false);
    }
  }

  private getStorageKey(): string {
    return `boton-filtros:${this.tipo}`;
  }

  onEspecieChange() {
    if (this.filtrosPets.especie) {
      // Filtrar razas por especie seleccionada
      this.razasFiltradas = this.todasLasRazas.filter(
        (raza: any) => raza.especie?.nombre === this.filtrosPets.especie
      );
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
    Object.keys(this.dropdownOpen).forEach(key => {
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
      this.especiesFiltradas = [];
      this.enfermedadesFiltradas = [];
    } else {
      this.filtrosVets = {};
      this.especialidadSearch = '';
      this.mascotaSearch = '';
      this.especialidadesFiltradas = [];
      this.mascotasFiltradas = [];
    }
    this.cerrarTodosLosDropdowns();
    this.tieneFilterActivos = false;
    this.filtrosEstadoService.eliminar(this.getStorageKey());
    this.aplicarFiltros(false);
  }

  aplicarFiltros(guardarEstado = true) {
    this.isLoading = true;
    
    if (this.tipo === 'pets') {
      this.filtrosService.getPetsFiltrados(this.filtrosPets).subscribe({
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
        }
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
        }
      });
    }
  }

  private verificarFiltrosActivos(): boolean {
    if (this.tipo === 'pets') {
      return Object.values(this.filtrosPets).some(v => v !== undefined && v !== null && v !== '') ||
             this.mostrarMisMascotas;
    } else {
      return Object.values(this.filtrosVets).some(v => v !== undefined && v !== null && v !== '');
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
    const dropdownWrapper = this.elementRef.nativeElement.querySelector(`[data-dropdown="${key}"]`);
    if (dropdownWrapper) {
      const triggerEl = dropdownWrapper.querySelector('input') || dropdownWrapper.querySelector('div');
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
          'overflow-y': 'auto'
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
    const openKey = Object.keys(this.dropdownOpen).find(k => this.dropdownOpen[k]);
    if (!openKey) {
      return;
    }

    const dropdownWrapper = this.elementRef.nativeElement.querySelector(`[data-dropdown="${openKey}"]`) as HTMLElement | null;
    const dropdownContent = this.elementRef.nativeElement.querySelector(`[data-dropdown-content="${openKey}"]`) as HTMLElement | null;
    if (!dropdownWrapper && !dropdownContent) {
      this.cerrarTodosLosDropdowns();
      return;
    }

    const clickedInsideWrapper = dropdownWrapper ? dropdownWrapper.contains(target) : false;
    const clickedInsideContent = dropdownContent ? dropdownContent.contains(target) : false;
    if (!clickedInsideWrapper && !clickedInsideContent) {
      this.cerrarTodosLosDropdowns();
    }
  }

  // Métodos de búsqueda y filtrado para PETS
  onEspecieSearchChange() {
    this.especiesFiltradas = this.especies.filter(e =>
      e.nombre.toLowerCase().includes(this.especieSearch.toLowerCase())
    );
  }

  selectEspeciePet(especie: any) {
    this.filtrosPets.especie = especie.nombre;
    this.especieSearch = especie.nombre;
    this.closeDropdown('especie');
    this.onEspecieChange(); // Filtrar razas
  }

  onRazaSearchChange() {
    this.razasFiltradas = this.todasLasRazas.filter(r =>
      r.especie?.nombre === this.filtrosPets.especie &&
      r.nombre.toLowerCase().includes(this.razaSearch.toLowerCase())
    );
  }

  selectRazaPet(raza: any) {
    this.filtrosPets.raza = raza.nombre;
    this.razaSearch = raza.nombre;
    this.closeDropdown('raza');
  }

  onEnfermedadSearchChange() {
    this.enfermedadesFiltradas = this.enfermedades.filter(e =>
      e.nombre.toLowerCase().includes(this.enfermedadSearch.toLowerCase())
    );
  }

  selectEnfermedad(enfermedad: any) {
    this.filtrosPets.enfermedad = enfermedad.nombre;
    this.enfermedadSearch = enfermedad.nombre;
    this.closeDropdown('enfermedad');
  }

  selectEstadoPet(estado: boolean | undefined) {
    this.filtrosPets.estado = estado;
    this.closeDropdown('estadoPet');
  }

  // Métodos de búsqueda y filtrado para VETS
  onEspecialidadSearchChange() {
    this.especialidadesFiltradas = this.especialidades.filter(e =>
      e.nombre.toLowerCase().includes(this.especialidadSearch.toLowerCase())
    );
  }

  selectEspecialidad(especialidad: any) {
    this.filtrosVets.especialidad = especialidad.nombre;
    this.especialidadSearch = especialidad.nombre;
    this.closeDropdown('especialidad');
  }

  selectEstadoVet(estado: boolean | undefined) {
    this.filtrosVets.estado = estado;
    this.closeDropdown('estadoVet');
  }

  onMascotaSearchChange() {
    this.mascotasFiltradas = this.mascotas.filter(m =>
      m.nombre.toLowerCase().includes(this.mascotaSearch.toLowerCase())
    );
  }

  selectMascota(mascota: any) {
    this.filtrosVets.pet = mascota.nombre;
    this.mascotaSearch = mascota.nombre;
    this.closeDropdown('mascota');
  }

}

