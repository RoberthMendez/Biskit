import { Component, Input } from '@angular/core';

type IconoPaso =
  | 'evaluacion'
  | 'plan'
  | 'estancia'
  | 'seguimiento'
  | 'alta';

@Component({
  selector: 'app-paso',
  imports: [],
  templateUrl: './paso.component.html',
  styleUrl: './paso.component.css'
})
export class PasoComponent {

  @Input()
  numero: number = 0;

  @Input()
  titulo: string = '';
  
  @Input()
  descripcion: string = '';

  @Input()
  icono: IconoPaso = 'evaluacion';

}
