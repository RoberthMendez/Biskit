import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { PetDTO } from '../../../../../models/dtos/pet-dto';

@Component({
  selector: 'app-card-info-pet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-info-pet.component.html',
})
export class CardInfoPetComponent implements AfterViewInit, OnChanges {
  @Input()
  pet!: PetDTO;

  @Input()
  vetId!: number;

  @Input()
  basePath = '';

  @Output()
  estadoChange = new EventEmitter<boolean>();

  @ViewChild('toggleSwitch')
  private toggleSwitchRef?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.updateTogglePillFromView();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    queueMicrotask(() => this.updateTogglePillFromView());
  }

  getEdad(fechaNacimiento: string | Date): number {
    if (!fechaNacimiento) return 0;

    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }

  private updateTogglePill(toggle: HTMLElement): void {
    const input = toggle.querySelector('input') as HTMLInputElement | null;
    const pill = toggle.querySelector('.toggle-pill') as HTMLElement | null;
    const spanInactive = toggle.querySelector(
      '.toggle-inactive',
    ) as HTMLElement | null;
    const spanActive = toggle.querySelector(
      '.toggle-active',
    ) as HTMLElement | null;

    if (!input || !pill || !spanInactive || !spanActive) {
      return;
    }

    const target = input.checked ? spanActive : spanInactive;

    pill.style.width = `${target.offsetWidth}px`;
    pill.style.left = `${target.offsetLeft}px`;
    pill.style.backgroundColor = input.checked ? '#E1F8EA' : '#EDEDED';
  }

  private updateTogglePillFromView(): void {
    const toggle = this.toggleSwitchRef?.nativeElement;
    if (toggle) {
      this.updateTogglePill(toggle);
    }
  }

  onToggleEstado(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.pet.estado = checkbox.checked;
    const toggle = checkbox.closest('.toggle-switch') as HTMLElement | null;
    if (toggle) {
      this.updateTogglePill(toggle);
    }

    this.estadoChange.emit(this.pet.estado);
  }
}
