import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BotonFiltrosComponent } from "../../../../reusables/boton-filtros/boton-filtros.component";
import { Vet } from "../../../../../models/Vets/vet-cl";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, BotonFiltrosComponent, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Input() adminId: number = 0;
  @Output() filtrosAplicados = new EventEmitter<any>();

  onFiltrosAplicados(vets: any) {
    this.filtrosAplicados.emit(vets);
  }

}
