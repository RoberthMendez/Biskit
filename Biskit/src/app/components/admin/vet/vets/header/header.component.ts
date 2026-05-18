import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonFiltrosComponent } from '../../../../reusables/boton-filtros/boton-filtros.component';
import { Vet } from '../../../../../models/Vets/vet-cl';
import { CommonModule } from '@angular/common';

// Expose a small API to reset filters from parent components

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, BotonFiltrosComponent, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() hayFiltrosActivos: boolean = false;
  @Output() filtrosAplicados = new EventEmitter<any>();
  @Output() filtrosActivosChange = new EventEmitter<boolean>();
  @Output() limpiarFiltros = new EventEmitter<void>();
  @ViewChild(BotonFiltrosComponent) botonFiltros?: BotonFiltrosComponent;

  onFiltrosAplicados(vets: any) {
    this.filtrosAplicados.emit(vets);
  }

  onFiltrosActivosChange(value: boolean): void {
    this.filtrosActivosChange.emit(value);
  }

  // Called by parent (VetsComponent) to reset filters without emitting
  public resetFiltersWithoutEmit(): void {
    this.botonFiltros?.resetWithoutEmit();
  }
}
