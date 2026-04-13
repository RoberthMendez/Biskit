import { Component } from '@angular/core';
import { PasoComponent } from './paso/paso.component';

type IconoPaso =
  | 'evaluacion'
  | 'plan'
  | 'estancia'
  | 'seguimiento'
  | 'alta';

interface Paso {
  numero: number;
  titulo: string;
  descripcion: string;
  icono: IconoPaso;
}

@Component({
  selector: 'app-proceso',
  imports: [PasoComponent],
  templateUrl: './proceso.component.html',
})
export class ProcesoComponent {
  pasos: Paso[] = [
    {
      numero: 1,
      titulo: 'Evaluación médica inicial',
      descripcion: 'Revisión completa del estado de salud de tu mascota.',
      icono: 'evaluacion'
    },
    {
      numero: 2,
      titulo: 'Plan de tratamiento personalizado',
      descripcion: 'Diseñamos un plan adaptado a las necesidades específicas.',
      icono: 'plan'
    },
    {
      numero: 3,
      titulo: 'Estancia hospitalaria',
      descripcion: 'Cuidados profesionales en instalaciones seguras y equipadas.',
      icono: 'estancia'
    },
    {
      numero: 4,
      titulo: 'Seguimiento continuo',
      descripcion: 'Monitoreo constante y comunicación con los dueños.',
      icono: 'seguimiento'
    },
    {
      numero: 5,
      titulo: 'Alta médica',
      descripcion: 'Entrega de recomendaciones para continuar el cuidado en casa.',
      icono: 'alta'
    }
  ];
}
