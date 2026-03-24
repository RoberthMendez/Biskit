import { Component } from '@angular/core';
import { DireccionComponent } from "./direccion/direccion.component";
import { CardComponent } from './card/card.component';

type IconoContacto =
  | 'telefono'
  | 'whatsapp'
  | 'horarios';

interface Contacto{

  icono: IconoContacto;
  titulo: string;
  descripcion: string;

}

@Component({
  selector: 'app-contacto',
  imports: [DireccionComponent, CardComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  contactos: Contacto[] = [
    {
      icono: 'telefono',
      titulo: 'Teléfono',
      descripcion: '+57 (319) 123-4567'
    },
    {
      icono: 'whatsapp',
      titulo: 'WhatsApp',
      descripcion: '+57 (319) 123-4567'
    },
    {
      icono: 'horarios',
      titulo: 'Horarios',
      descripcion: 'Lun-Dom: 24 horas'
    }
  ]

}
