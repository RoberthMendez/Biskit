// clients-search.component.ts
import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-clients-buscador',
  templateUrl: './clients-buscador.component.html'
})
export class ClientsSearchComponent {

  @Output() search = new EventEmitter<string>();

  onInput(event: any) {
    this.search.emit(event.target.value);
  }

  // Clear visible input without emitting
  clear(): void {
    const input = this.inputRef?.nativeElement as HTMLInputElement | undefined;
    if (input) {
      input.value = '';
    }
  }

  @ViewChild('clientsSearchInput', { static: false }) inputRef?: ElementRef<HTMLInputElement>;
}
