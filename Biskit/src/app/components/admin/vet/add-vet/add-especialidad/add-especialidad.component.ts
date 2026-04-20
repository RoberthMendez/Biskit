import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
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
export class AddEspecialidadComponent implements AfterViewInit {
  /** Cierra el modal sin hacer nada. */
  @Output() close = new EventEmitter<void>();

  /** Emite la especialidad recién creada. */
  @Output() especialidadCreated = new EventEmitter<Especialidad>();

  nombre = '';
  error = '';
  loading = false;
  @ViewChild('nombreInput') nombreInput?: ElementRef<HTMLInputElement>;

  constructor(private especialidadesService: EspecialidadesService) {}

  ngAfterViewInit(): void {
    // Enfocar el input al abrir el modal para evitar perder la primera tecla.
    setTimeout(() => this.nombreInput?.nativeElement.focus());
  }

  save(): void {
    
    if (this.loading) {
      return;
    }

    const trimmed = this.nombre.trim();
    if (!trimmed) {
      this.error = 'Ingresa el nombre de la especialidad';
      return;
    }

    this.error = '';
    this.loading = true;

    const nuevaEspecialidad = new Especialidad(undefined, trimmed);

    this.especialidadesService.addEspecialidad(nuevaEspecialidad).subscribe({
      next: (creada) => {
        const especialidadCreada = new Especialidad(
          creada?.id,
          creada?.nombre ?? trimmed,
        );
        this.especialidadCreated.emit(especialidadCreada);
        this.nombre = '';
        this.loading = false;
      },
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          this.error =
            err.error?.message ||
            err.error?.error ||
            err.message ||
            'Error al agregar la especialidad';
        } else {
          this.error =
            err instanceof Error
              ? err.message
              : 'Error al agregar la especialidad';
        }
        this.loading = false;
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
