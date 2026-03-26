import { Component } from '@angular/core';
import { RazonComponent } from './razon/razon.component';

type IconoRazon =
  | 'atencion'
  | 'instalaciones'
  | 'trato'
  | 'comunicacion'
  | 'prioridad';

interface Razon {
  titulo: string;
  icono: IconoRazon;
}

@Component({
  selector: 'app-por-que',
  imports: [RazonComponent],
  templateUrl: './por-que.component.html',
})
export class PorQueComponent {

  razones: Razon[] = [
    {
      titulo: 'Atención profesional especializada',
      icono: 'atencion'
    },
    {
      titulo: 'Instalaciones seguras y equipadas',
      icono: 'instalaciones'
    },
    {
      titulo: 'Trato amoroso y respetuoso',
      icono: 'trato'
    },
    {
      titulo: 'Comunicación constante con los dueños',
      icono: 'comunicacion'
    },
    {
      titulo: 'Prioridad en el bienestar y recuperación',
      icono: 'prioridad'
    }
  ]

}
