import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from '../../../../../models/Pets/pet';

@Component({
  selector: 'app-card-info-pet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-info-pet.component.html',
})
export class CardInfoPetComponent implements AfterViewInit, OnChanges {

  @Input()
  pet!: Pet;

  @Output()
  estadoChange = new EventEmitter<boolean>();

  @ViewChild('toggleSwitch')
  private toggleSwitchRef?: ElementRef<HTMLElement>;

  @ViewChild('toggleInput')
  private toggleInputRef?: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.updateTogglePillFromView();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    queueMicrotask(() => this.updateTogglePillFromView());
  }

  getEdad(fechaNacimiento: string | Date): number {

    if (!fechaNacimiento)
      return 0;

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
    const spanInactive = toggle.querySelector('.toggle-inactive') as HTMLElement | null;
    const spanActive = toggle.querySelector('.toggle-active') as HTMLElement | null;

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

  private revertirCheckbox(nuevoEstado: boolean): void {
    const checkbox = this.toggleInputRef?.nativeElement;
    if (!checkbox) {
      return;
    }

    checkbox.checked = !nuevoEstado;
    this.pet.estado = checkbox.checked;
    this.updateTogglePillFromView();
  }

  private cambiarEstadoMascota(_id: number, _nuevoEstado: boolean): void {
    // Si falla persistencia en backend, descomentar y usar revertirCheckbox(_nuevoEstado).
  }

  onToggleEstado(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.pet.estado = checkbox.checked;
    const toggle = checkbox.closest('.toggle-switch') as HTMLElement | null;
    if (toggle) {
      this.updateTogglePill(toggle);
    }

    this.estadoChange.emit(this.pet.estado);

    if (this.pet.id != null) {
      this.cambiarEstadoMascota(this.pet.id, this.pet.estado);
    }
  }

}
