import { Component } from '@angular/core';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [FormularioComponent, ImagenComponent, RouterLink],
  templateUrl: './add-vet.component.html',
})
export class AddVetComponent {

  vetId: number | null = null;
  adminId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idVet = this.route.snapshot.paramMap.get('idVet');
    this.vetId = idVet ? Number(idVet) : null;

    const idAdmin = this.route.snapshot.paramMap.get('idAdmin');
    this.adminId = idAdmin ? Number(idAdmin) : null;
  }

}
