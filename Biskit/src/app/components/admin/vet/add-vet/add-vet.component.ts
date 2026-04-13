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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.vetId = id ? Number(id) : null;
  }

}
