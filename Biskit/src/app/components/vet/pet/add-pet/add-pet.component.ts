import { Component } from '@angular/core';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';
import { VetService } from '../../../../services/vet.service';
import { PetService } from '../../../../services/pet.service';
import { AdminService } from '../../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BackButtonComponent } from '../../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [FormularioComponent, ImagenComponent, BackButtonComponent],
  templateUrl: './add-pet.component.html',
})
export class AddPetComponent {
  petId: number | null = null;
  vetId: number = 0;
  basePath = '';
  isAdminView = false;
  backLink: string | Array<string | number> = '';
  backLabel = 'Lista de Mascotas';

  constructor(
    private route: ActivatedRoute,
    private vetService: VetService,
    private petService: PetService,
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.comprobarIds();

    const id = this.route.snapshot.paramMap.get('petId');
    this.petId = id ? Number(id) : null;
    const routePath = this.route.snapshot.routeConfig?.path ?? '';
    this.isAdminView = routePath.startsWith('admin/');
    const contextParam = this.isAdminView ? 'idAdmin' : 'vetId';
    this.vetId = Number(this.route.snapshot.paramMap.get(contextParam));
    this.basePath = `/${this.isAdminView ? 'admin' : 'vet'}/${this.vetId}`;
    this.updateBackNavigation();
  }

  private updateBackNavigation(): void {
    const fromDetail =
      this.route.snapshot.queryParamMap.get('from') === 'detail';

    if (this.petId != null && fromDetail) {
      this.backLink = `${this.basePath}/pets/${this.petId}`;
      this.backLabel = 'Detalle de Mascota';
      return;
    }

    this.backLink = `${this.basePath}/pets`;
    this.backLabel = 'Lista de Mascotas';
  }

  private comprobarIds() {
    const vetIdParam = Number(this.route.snapshot.paramMap.get('vetId'));
    if (vetIdParam) {
      this.vetService.existsById(vetIdParam).subscribe({
        next: () => {
          this.vetId = vetIdParam;
        },
        error: (error) => {
          const mensaje = error.error?.detalle || 'Veterinario no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }

    const petIdParam = Number(this.route.snapshot.paramMap.get('petId'));
    if (petIdParam) {
      this.petService.existsById(petIdParam).subscribe({
        next: () => {},
        error: (error) => {
          const mensaje = error.error?.detalle || 'Mascota no encontrada';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }

    const adminIdParam = Number(this.route.snapshot.paramMap.get('idAdmin'));
    if (adminIdParam) {
      this.adminService.existsById(adminIdParam).subscribe({
        next: () => {},
        error: (error) => {
          const mensaje = error.error?.detalle || 'Administrador no encontrado';
          this.router.navigate(['/error'], {
            queryParams: { mensaje },
          });
        },
      });
    }
  }
}
