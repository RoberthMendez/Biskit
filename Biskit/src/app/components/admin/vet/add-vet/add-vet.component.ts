import { Component } from '@angular/core';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';
import { Router, ActivatedRoute } from '@angular/router';
import { VetService } from '../../../../services/vet.service';
import { AdminService } from '../../../../services/admin.service';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-add-vet',
  standalone: true,
  imports: [FormularioComponent, ImagenComponent, BackButtonComponent],
  templateUrl: './add-vet.component.html',
})
export class AddVetComponent {
  vetId: number | null = null;
  backLink: Array<string | number> = ['/admin', 'vets'];
  backLabel = 'Lista de Veterinarios';
  returnRoute: string | Array<string | number> = ['/admin', 'vets'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vetService: VetService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    const idVet = this.route.snapshot.paramMap.get('idVet');
    this.vetId = idVet ? Number(idVet) : null;

    const fromDetail =
      this.route.snapshot.queryParamMap.get('from') === 'detail';
    if (this.vetId != null && fromDetail) {
      this.backLink = ['/admin', 'vets', this.vetId];
      this.backLabel = 'Detalle de Veterinario';
      this.returnRoute = ['/admin', 'vets', this.vetId];
    }
  }
}
