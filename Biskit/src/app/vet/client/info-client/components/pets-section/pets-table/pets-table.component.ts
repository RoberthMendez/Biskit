import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets-table',
  imports: [CommonModule],
  templateUrl: './pets-table.component.html',
})
export class PetsTableComponent {
  @Input() pets: any[] = [];

  getEdadTexto(edad: number): string {
    return edad === 1 ? `${edad} año` : `${edad} años`;
  }
}
