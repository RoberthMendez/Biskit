import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Pet } from '../../../../../models/Pets/pet';
import { Tratamiento } from '../../../../../models/Tratamiento/tratamiento';
import { Droga } from '../../../../../models/Droga/droga';

@Component({
  selector: 'app-card-info-tratamientos',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './card-info-tratamientos.component.html',
})
export class CardInfoTratamientosComponent {
  
  @Input() pet!: Pet;

  @Input() vetId!: number;

  protected get sortedTratamientos(): Tratamiento[] {
    return [...(this.pet.tratamientos ?? [])].sort(
      (a, b) => this.getTimestamp(b.fecha) - this.getTimestamp(a.fecha),
    );
  }

  private getTimestamp(value: Date | string): number {
    const parsed = value instanceof Date ? value.getTime() : new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  protected getDrugColumns(drogas: Droga[]): Droga[][] {
    const columns: Droga[][] = [];
    for (let i = 0; i < drogas.length; i += 3) {
      columns.push(drogas.slice(i, i + 3));
    }
    return columns;
  }
}
