import { Component } from '@angular/core';
import { VetService } from '../../../../services/vet.service';
import { Vet } from '../../../../models/Vets/vet-cl';

@Component({
  selector: 'app-vets',
  imports: [],
  templateUrl: './vets.component.html'
})
export class VetsComponent {

  public vets: Vet[] = [];
  public searchTerm: string = '';


  constructor(private vetService: VetService) {}

  ngOnInit() {
    this.vetService.findAll().subscribe(
      (vets) => {
        this.vets = vets;
      }
    );
  }

  //filtrar veterinarios por nombre, correo o cedula
  get filteredVets(): Vet[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.vets;
    return this.vets.filter((vet) =>
      vet.nombre.toLowerCase().includes(term) ||
      vet.correo.toLowerCase().includes(term) ||
      vet.cedula.toLowerCase().includes(term)
    );
  }

}
