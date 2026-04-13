// clients-search.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

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
}
