import { Component } from '@angular/core';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [FormularioComponent, ImagenComponent, RouterLink],
  templateUrl: './add-pet.component.html',
})
export class AddPetComponent {

  petId: number | null = null;
  vetId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('petId');
    this.petId = id ? Number(id) : null;
    this.vetId = Number(this.route.snapshot.paramMap.get('vetId'));
    
  }
}
