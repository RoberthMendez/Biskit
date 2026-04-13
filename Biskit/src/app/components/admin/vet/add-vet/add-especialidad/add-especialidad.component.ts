import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { EspecialidadesService } from '../../../../../services/especialidades.service';
import { Especialidad } from '../../../../../models/Vets/Especialidad/especialidad';

@Component({
  selector: 'app-add-especialidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-especialidad.component.html',
  animations: [
    trigger('backdropAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'scale(0.95) translateY(-8px)' }),
        ),
      ]),
    ]),
  ],
})
export class AddEspecialidadComponent {
  /** Cierra el modal sin hacer nada. */
  @Output() close = new EventEmitter<void>();

  /** Emite la especialidad recién creada. */
  @Output() especialidadCreated = new EventEmitter<Especialidad>();

  nombre = '';
  error = '';
  loading = false;

  constructor(private especialidadesService: EspecialidadesService) {}

  async save(): Promise<void> {
    const trimmed = this.nombre.trim();
    if (!trimmed) {
      this.error = 'Ingresa el nombre de la especialidad';
      return;
    }

    this.error = '';
    this.loading = true;

    try {
      const nuevaEspecialidad = new Especialidad(undefined, trimmed);
      this.especialidadesService.addEspecialidad(nuevaEspecialidad);
      // El servicio muta el objeto y le asigna el id internamente,
      // así que ya tiene id después de la llamada
      this.especialidadCreated.emit(nuevaEspecialidad);
    } catch (err: unknown) {
      this.error =
        err instanceof Error ? err.message : 'Error al agregar la especialidad';
    } finally {
      this.loading = false;
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
