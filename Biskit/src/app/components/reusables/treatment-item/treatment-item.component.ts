import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tratamiento } from '../../../models/Tratamiento/tratamiento';
import { ItemTratamientoDto } from '../../../models/dtos/item-tratamiento-dto';

type TreatmentItem = Tratamiento | ItemTratamientoDto;

@Component({
  selector: 'app-treatment-item',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './treatment-item.component.html',
  host: {
    class: 'contents',
  },
})
export class TreatmentItemComponent {
  @Input() tratamiento!: TreatmentItem;

  @Input() clientId?: number;

  @Input() petId?: number;

  @Input() link: Array<string | number> | null = null;

  @Input() state?: Record<string, any>;

  @Input() variant: 'client' | 'vet' = 'client';

  @Input() showPetName?: boolean;

  @Input('t')
  set legacyTreatment(value: TreatmentItem) {
    this.tratamiento = value;
  }

  protected get petName(): string {
    return this.getPetName(this.tratamiento);
  }

  protected get fecha(): string | Date {
    return this.tratamiento?.fecha ?? '';
  }

  protected get drugNames(): string[] {
    return this.getDrugNames(this.tratamiento);
  }

  protected get treatmentLink(): Array<string | number> | null {
    if (this.link?.length) {
      return this.link;
    }

    if (
      this.clientId == null ||
      this.petId == null ||
      this.tratamiento?.id == null
    ) {
      return null;
    }

    return [
      '/client',
      this.clientId,
      'pet',
      this.petId,
      'tratamiento',
      this.tratamiento.id,
    ];
  }

  protected get itemClasses(): string {
    return this.variant === 'vet'
      ? 'cursor-pointer mx-4 mb-2 flex items-stretch gap-2 rounded-lg p-2 transition hover:bg-blue-50'
      : 'cursor-pointer mx-5 mb-3.25 flex items-stretch gap-2 rounded-lg p-2 transition hover:bg-blue-50';
  }

  protected get dateClasses(): string {
    return this.variant === 'vet'
      ? 'text-xs font-semibold text-[#8D8580]'
      : 'text-sm font-semibold text-[#8D8580]';
  }

  protected get drugGridClasses(): string {
    const drugCount = this.drugNames.length;
    const base = 'custom-scroll grid gap-x-4 gap-y-2 pr-1';

    const columns =
      drugCount <= 3
        ? 'grid-cols-1'
        : drugCount <= 6
          ? 'grid-cols-2'
          : drugCount <= 9
            ? 'grid-cols-3'
            : 'grid-cols-4';

    const overflow =
      this.variant === 'vet'
        ? drugCount > 12
          ? 'overflow-y-auto'
          : 'overflow-visible'
        : drugCount > 9
          ? 'overflow-y-auto'
          : 'overflow-visible';

    return `${base} ${columns} ${overflow}`;
  }

  protected get drugGridMaxHeight(): string {
    const rows = Math.min(Math.max(this.drugNames.length, 1), 3);
    const textLineHeightRem = 1.5;
    const rowGapRem = 0.125;

    return `${rows * textLineHeightRem + (rows - 1) * rowGapRem}rem`;
  }

  protected getDrugColumns(drogas: string[]): string[][] {
    const columns: string[][] = [];
    for (let i = 0; i < drogas.length; i += 3) {
      columns.push(drogas.slice(i, i + 3));
    }
    return columns;
  }

  private getPetName(tratamiento?: TreatmentItem): string {
    if (!tratamiento) {
      return '';
    }

    if ('petNombre' in tratamiento) {
      return tratamiento.petNombre;
    }

    return tratamiento.pet?.nombre ?? '';
  }

  private getDrugNames(tratamiento?: TreatmentItem): string[] {
    if (!tratamiento) {
      return [];
    }

    if ('drogasNombres' in tratamiento) {
      return tratamiento.drogasNombres;
    }

    return (tratamiento.drogas ?? []).map(
      (droga: { nombre: string }) => droga.nombre,
    );
  }
}
