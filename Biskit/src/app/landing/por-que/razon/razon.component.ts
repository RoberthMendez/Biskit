import { Component, Input } from '@angular/core';

type IconoRazon =
  | 'atencion'
  | 'instalaciones'
  | 'trato'
  | 'comunicacion'
  | 'prioridad';

@Component({
  selector: 'app-razon',
  imports: [],
  templateUrl: './razon.component.html',
  styleUrl: './razon.component.css'
})
export class RazonComponent {

  @Input()
  titulo: string = '';

  @Input()
  icono: IconoRazon = 'atencion';

}
