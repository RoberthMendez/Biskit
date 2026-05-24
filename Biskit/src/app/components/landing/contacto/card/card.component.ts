import { Component, Input } from '@angular/core';

type IconoContacto = 'correo' | 'whatsapp' | 'horarios';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input()
  icono: IconoContacto = 'correo';

  @Input()
  titulo: string = '';

  @Input()
  descripcion: string = '';
}
