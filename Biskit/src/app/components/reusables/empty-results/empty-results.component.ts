import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-results.component.html',
})
export class EmptyResultsComponent {
  @Input() message: string = 'No se encontraron resultados';
  @Input() showButton: boolean = true;
  @Input() buttonLabel: string = 'Limpiar búsqueda';
  @Output() clear = new EventEmitter<void>();

  onClear() {
    this.clear.emit();
  }
}
