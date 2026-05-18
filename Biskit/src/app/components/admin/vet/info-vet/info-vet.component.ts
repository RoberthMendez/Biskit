import { Component } from '@angular/core';
import { VetService } from '../../../../services/vet.service';
import { Vet } from '../../../../models/Vets/vet-cl';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs';
import { AdminService } from '../../../../services/admin.service';
import { TratamientoService } from '../../../../services/tratamiento.service';
import { DeleteModalComponent } from '../../../reusables/delete-modal/delete-modal.component';
import { TreatmentsCardComponent } from '../../../reusables/treatments-card/treatments-card.component';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';
import { CardInfoVetComponent } from './card-info-vet/card-info-vet.component';
import { ItemTratamientoDto } from '../../../../models/dtos/item-tratamiento-dto';

@Component({
  selector: 'app-info-vet',
  standalone: true,
  imports: [
    DeleteModalComponent,
    TreatmentsCardComponent,
    NgComponentOutlet,
    BackButtonComponent,
  ],
  templateUrl: './info-vet.component.html',
})
export class InfoVetComponent {
  vet!: Vet;
  tratamientos: ItemTratamientoDto[] = [];
  protected vetCardComponent = CardInfoVetComponent;

  constructor(
    private vetService: VetService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  protected get vetCardInputs(): Record<string, unknown> {
    return {
      vet: this.vet,
      onDelete: this.openDeleteModal.bind(this),
    };
  }

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
          return this.vetService.findTratamientosByVet(vetId);
        }),
      )
      .subscribe({
        next: (tratamientos) => {
          this.tratamientos = tratamientos;
        },
      });
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
      this.router.navigate(['/admin', 'vets']);
    }
  }

  confirmDelete() {
    if (this.selectedDeleteId != null) {
      this.vetService.deleteVet(this.selectedDeleteId).subscribe(() => {
        this.shouldNavigateAfterDelete = true;
        this.deleteSuccessMessage = 'Veterinario eliminado correctamente';
      });
      return;
    }

    this.closeModal();
  }
}
