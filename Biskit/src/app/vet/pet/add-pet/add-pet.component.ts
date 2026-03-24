import { Component } from '@angular/core';
import { FooterComponent } from '../../../reusables/footer/footer.component';
import { FormularioComponent } from './formulario/formulario.component';
import { ImagenComponent } from './imagen/imagen.component';

@Component({
  selector: 'app-add-pet',
  standalone: true,
  imports: [FooterComponent, FormularioComponent, ImagenComponent],
  templateUrl: './add-pet.component.html',
  styleUrl: './add-pet.component.css',
})
export class AddPetComponent {}
