import { Component, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TreatmentItemComponent } from '../../client/info-pet/treatment-item/treatment-item.component';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';

@Component({
  selector: 'app-treatments-card',
  standalone: true,
  imports: [TreatmentItemComponent, RouterLink],
  templateUrl: './treatments-card.component.html',
  host: {
    class: 'block w-full',
  },
})
export class TreatmentsCardComponent {
  @Input() title = '';

  @Input() petActivo?: boolean;

  @Input() helperText = '';

  @Input() tratamientos: Tratamiento[] = [];

  @Input() routeBase: Array<string | number> = [];

  @Input() routeSegment = 'pet';

  @Input() entityId?: number;

  @Input() variant: 'client' | 'vet' = 'client';

  @Input() listVariant?: 'client' | 'vet';

  @Input() showPetName?: boolean;

  @Input() showAddButton = false;

  @Input() addButtonLabel = 'Agregar Tratamiento';

  @Input() estadoAtras?: Record<string, any>;

  constructor(public router: Router) {}

  protected get cardClasses(): string {
    return this.variant === 'vet'
      ? 'mx-auto flex w-full flex-col rounded-2xl bg-[#FBFAF8] p-5 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)]'
      : 'flex w-full flex-col rounded-2xl bg-[#FBFAF8] p-6 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12)]';
  }

  protected get listClasses(): string {
    const base =
      'custom-scroll mb-4 grid grid-cols-1 justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2';

    const effectiveListVariant = this.listVariant ?? this.variant;

    if (effectiveListVariant === 'vet') {
      const extraClasses =
        this.tratamientos.length > 4
          ? 'max-h-[18rem] overflow-y-auto'
          : 'overflow-visible';

      return `${base} ${extraClasses}`;
    }

    const extraClasses =
      this.tratamientos.length === 0
        ? 'min-h-20 place-content-center overflow-visible'
        : this.tratamientos.length > 4
          ? 'max-h-[23rem] overflow-y-auto'
          : 'overflow-visible';

    return `${base} ${extraClasses}`;
  }

  protected get addButtonLink(): Array<string | number> | null {
    if (!this.showAddButton || this.routeBase.length === 0) {
      return null;
    }

    if (this.routeSegment === 'tratamientos') {
      return [...this.routeBase, this.routeSegment, 'add'];
    }

    if (this.entityId == null) {
      return null;
    }

    return [
      ...this.routeBase,
      this.routeSegment,
      this.entityId,
      'tratamiento',
      'add',
    ];
  }

  protected getTreatmentLink(
    tratamiento: Tratamiento,
  ): Array<string | number> | null {
    if (this.routeBase.length === 0 || tratamiento.id == null) {
      return null;
    }

    if (this.routeSegment === 'tratamientos') {
      return [...this.routeBase, this.routeSegment, tratamiento.id];
    }

    if (this.entityId == null) {
      return null;
    }

    return [
      ...this.routeBase,
      this.routeSegment,
      this.entityId,
      'tratamiento',
      tratamiento.id,
    ];
  }
}
