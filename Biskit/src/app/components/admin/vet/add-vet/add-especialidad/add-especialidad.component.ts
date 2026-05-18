import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnInit,
  SimpleChanges,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  animations: [backdropAnimation(), cardAnimation()],
})
export class AddEspecialidadComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() visible = false;

  /** Cierra el modal sin hacer nada. */
  @Output() close = new EventEmitter<void>();

  /** Emite la especialidad recién creada. */
  @Output() especialidadCreated = new EventEmitter<Especialidad>();

  nombre = '';
  error = '';
  success = '';
  loading = false;
  renderModal = false;
  @ViewChild('nombreInput') nombreInput?: ElementRef<HTMLInputElement>;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private especialidadesService: EspecialidadesService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    if (this.visible) {
      this.openModal();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        this.openModal();
      } else {
        this.beginCloseAnimation();
      }
    }
  }

  ngAfterViewInit(): void {
    // Enfocar el input al abrir el modal para evitar perder la primera tecla.
    if (this.visible) {
      setTimeout(() => this.nombreInput?.nativeElement.focus());
    }
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
    this.success = '';
    this.loading = true;

    const nuevaEspecialidad = new Especialidad(undefined, trimmed);

    this.especialidadesService.addEspecialidad(nuevaEspecialidad).subscribe({
      next: (creada) => {
        const especialidadCreada = new Especialidad(
          creada?.id,
          creada?.nombre ?? trimmed,
        );
        this.especialidadCreated.emit(especialidadCreada);
        this.success = 'Especialidad agregada correctamente';
        this.error = '';
        this.nombre = '';
        this.loading = false;

        this.closeTimeout = setTimeout(() => {
          this.close.emit();
        }, 600);
      },
      error: (err: unknown) => {
        this.success = '';
        this.error = this.getBackendErrorMessage(
          err,
          'Error al agregar la especialidad',
        );
        this.loading = false;
      },
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  private openModal(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    this.renderModal = true;
    this.error = '';
    this.success = '';
    this.document.documentElement.classList.add('add-especialidad-modal-open');

    setTimeout(() => this.nombreInput?.nativeElement.focus());
  }

  private beginCloseAnimation(): void {
    if (!this.renderModal) {
      return;
    }

    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    this.closeTimeout = setTimeout(() => {
      this.renderModal = false;
      this.closeTimeout = null;
      this.error = '';
      this.success = '';
      this.loading = false;
      this.nombre = '';
      this.document.documentElement.classList.remove(
        'add-especialidad-modal-open',
      );
    }, 150);
  }

  private getBackendErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;

      if (typeof body === 'string' && body.trim()) {
        return body;
      }

      const message =
        body?.detalle ||
        body?.detail ||
        body?.message ||
        body?.mensaje ||
        body?.error ||
        err.message;

      return message || fallback;
    }

    return err instanceof Error ? err.message : fallback;
  }
}

// CÓDIGO DE ANIMACIONES
function backdropAnimation() {
  return trigger('backdropAnim', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('150ms ease-out', style({ opacity: 1 })),
    ]),
    transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
  ]);
}

function cardAnimation() {
  return trigger('cardAnim', [
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
  ]);
}
