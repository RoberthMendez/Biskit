import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
})
export class CardComponent {

  @Input() imagen: string = '';
  @Input() titulo: string = '';
  @Input() descripcion: string = '';
  
}
