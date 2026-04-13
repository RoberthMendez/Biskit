import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets-table',
  imports: [CommonModule],
  templateUrl: './pets-table.component.html',
})
export class PetsTableComponent {
  @Input() pets: any[] = [];

   getEdad(fechaNacimiento: string | Date): number {

    if (!fechaNacimiento) 
      return 0;
    
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad;
      
  }
}
