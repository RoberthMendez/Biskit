import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-barra-busqueda',
  imports: [],
  templateUrl: './barra-busqueda.component.html'
})
export class BarraBusquedaComponent {

  @Output() search = new EventEmitter<string>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.search.emit(target?.value ?? '');
  }

}
