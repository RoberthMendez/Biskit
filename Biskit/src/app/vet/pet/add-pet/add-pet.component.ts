import { Component } from '@angular/core';
import { FooterComponent } from '../../../reusables/footer/footer.component';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [FooterComponent, FormularioComponent, ImagenComponent, RouterLink],
  templateUrl: './add-pet.component.html',
  styleUrl: './add-pet.component.css',
})
export class AddPetComponent {

  petId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.petId = id ? Number(id) : null;
  }
}
