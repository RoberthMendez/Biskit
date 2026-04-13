import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pet } from '../../../../../models/Pets/pet';
import { PetService } from '../../../../../services/pet.service';

@Component({
  selector: 'app-card-pet',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-pet.component.html',
})
export class CardPetComponent {

  @Input()
  pet!: Pet;

  @ViewChild('toggleSwitch')
  private toggleSwitchRef?: ElementRef<HTMLElement>;

  @ViewChild('toggleInput')
  private toggleInputRef?: ElementRef<HTMLInputElement>;

  constructor(private petService: PetService) {}

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

  private cambiarEstadoMascota(id: number, nuevoEstado: boolean): void {
    // this.petService.updateEstadoRequest(id, nuevoEstado).subscribe({
    //   next: (data) => {
    //     if (data && data.ok === false) {
    //       console.error('Error al cambiar estado:', data.message);
    //       this.revertirCheckbox(nuevoEstado);
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error al cambiar estado:', error);
    //     this.revertirCheckbox(nuevoEstado);
    //   },
    // });
  }

  onToggleEstado(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.pet.estado = checkbox.checked;
    const toggle = checkbox.closest('.toggle-switch') as HTMLElement | null;
    if (toggle) {
      this.updateTogglePill(toggle);
    }

    if (this.pet.id != null) {
      this.cambiarEstadoMascota(this.pet.id, this.pet.estado);
    }
  }
}
