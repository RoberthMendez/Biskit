import { Component, Input } from '@angular/core';

type IconoContacto = 
  | 'telefono'
  | 'whatsapp'
  | 'horarios';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  @Input()
  icono: IconoContacto = 'telefono';

  @Input()
  titulo: string = '';

  @Input()
  descripcion: string = '';

}
