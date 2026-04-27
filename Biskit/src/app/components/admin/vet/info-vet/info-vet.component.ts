import { Component } from '@angular/core';
import { VetService } from '../../../../services/vet.service';
import { Vet } from '../../../../models/Vets/vet-cl';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { TratamientoService } from '../../../../services/tratamiento.service';
import { DeleteModalComponent } from '../../../reusables/delete-modal/delete-modal.component';

@Component({
  selector: 'app-info-vet',
  imports: [DeleteModalComponent],
  templateUrl: './info-vet.component.html',
})
export class InfoVetComponent {
  vet!: Vet;

  constructor(
    private vetService: VetService,
    private route: ActivatedRoute,
    private router: Router,
    private tratamientoService: TratamientoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('vetId');
    const vetId = Number(id);

    if (!vetId) {
      console.error('Parametro vetId invalido en la ruta:', id);
      return;
    }

    this.vetService
      .findById(vetId)
      .pipe(
        mergeMap((vet) => {
          this.vet = vet;
          return this.tratamientoService.findTratamientosByVet(vetId);
        }),
      )
      .subscribe({
      next: (tratamientos) => {
        this.vet.tratamientos = tratamientos;
      },
    });
  }

  onEstadoChange(nuevoEstado: boolean): void {
    if (this.vet.id != null) {
      this.vet.estado = nuevoEstado;

      this.vetService.updateEstado(this.vet.id, nuevoEstado).subscribe({
        error: (error) => {
          console.error('Error al actualizar el estado del veterinario:', error);
          this.vet.estado = !nuevoEstado;
        },
      });
    }
  }

  /// Modal para eliminar veterinario

  showModal = false;
  selectedDeleteId: number | null = null;
  deleteSuccessMessage = '';
  shouldNavigateAfterDelete = false;

  openDeleteModal(vetId?: number) {
    this.selectedDeleteId = vetId ?? null;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;
    this.showModal = true;
  }

  closeModal() {
    const shouldNavigate = this.shouldNavigateAfterDelete;
    this.showModal = false;
    this.selectedDeleteId = null;
    this.deleteSuccessMessage = '';
    this.shouldNavigateAfterDelete = false;

    if (shouldNavigate) {
      this.router.navigate(['/vet/vets']);
    }
  }

  confirmDelete() {
    if (this.selectedDeleteId != null) {
      this.vetService.deleteVet(this.selectedDeleteId).subscribe(
        () => {
          this.shouldNavigateAfterDelete = true;
          this.deleteSuccessMessage = 'Veterinario eliminado correctamente';
        }
      );
      return;
    }

    this.closeModal();
  }


}
