import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-kpi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-kpi.component.html'
})
export class CardKPIComponent {

  

  @Input() titulo: string = '';
  @Input() valor: number = 0;

  get valorFormateado(): string {
    return new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0,
    }).format(this.valor);
  }

}
