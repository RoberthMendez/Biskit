import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Vet } from '../../../../../models/Vets/vet-cl';

@Component({
  selector: 'app-vet-card-mobile',
  standalone: true,
  templateUrl: './mobile-vet-card.component.html',
})
export class MobileVetCardComponent {
  
  @Input() vet!: Vet;
  @Output() cardClick = new EventEmitter<Vet>();
  @Output() edit = new EventEmitter<Vet>();
  @Output() delete = new EventEmitter<Vet>();

  public onCardClick(): void {
    if (this.vet) {
      this.cardClick.emit(this.vet);
    }
  }

  public onEdit(): void {
    if (this.vet) {
      this.edit.emit(this.vet);
    }
  }

  public onDelete(): void {
    if (this.vet) {
      this.delete.emit(this.vet);
    }
  }
}
