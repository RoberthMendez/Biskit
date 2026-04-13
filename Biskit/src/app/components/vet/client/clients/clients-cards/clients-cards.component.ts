// clients-cards.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientCardComponent } from '../client-card/client-card.component';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-clients-cards',
  templateUrl: './clients-cards.component.html',
  imports: [CommonModule, ClientCardComponent, RouterLink]
})
export class ClientsCardsComponent {
  @Input() clients: any[] = [];
  @Output() delete = new EventEmitter<number>();
}