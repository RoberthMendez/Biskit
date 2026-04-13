// client-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-client-card',
  templateUrl: './client-card.component.html'
})
export class ClientCardComponent {
  @Input() client: any;
  @Output() delete = new EventEmitter<number>();
}