import { Component } from '@angular/core';
import { DireccionComponent } from './direccion/direccion.component';
import { CardComponent } from './card/card.component';

type IconoContacto = 'correo' | 'whatsapp' | 'horarios';

interface Contacto {
  icono: IconoContacto;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-contacto',
  imports: [DireccionComponent, CardComponent],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  contactos: Contacto[] = [
    {
      icono: 'correo',
      titulo: 'Correo',
      descripcion: 'veterinariabiskit@gmail.com',
    },
    {
      icono: 'whatsapp',
      titulo: 'WhatsApp',
      descripcion: '+57 (313) 896-4087',
    },
    {
      icono: 'horarios',
      titulo: 'Horarios',
      descripcion: 'Lun-Dom: 24 horas',
    },
  ];
}
