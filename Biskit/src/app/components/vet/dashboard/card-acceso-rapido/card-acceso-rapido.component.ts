import { Component, Input } from '@angular/core';
import { ItemAccesoRapidoComponent } from './item-acceso-rapido/item-acceso-rapido.component';

@Component({
  selector: 'app-card-acceso-rapido',
  imports: [ItemAccesoRapidoComponent],
  templateUrl: './card-acceso-rapido.component.html',
})
export class CardAccesoRapidoComponent {}
