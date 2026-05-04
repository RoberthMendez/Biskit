import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

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

  // Clear the visible input without emitting an event
  clear(): void {
    const input = this.inputRef?.nativeElement as HTMLInputElement | undefined;
    if (input) {
      input.value = '';
    }
  }

  @ViewChild('searchInput', { static: false }) inputRef?: ElementRef<HTMLInputElement>;

}
