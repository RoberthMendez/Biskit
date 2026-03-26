import { Component } from '@angular/core';
import { CardComponent } from "./card/card.component";

interface Card {
  imagen: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-servicios',
  imports: [CardComponent],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent {

  cards: Card[] = [
    {
      imagen: '/images/landing/servicios/hospitalizacion.jpg',
      titulo: 'Hospitalización para perros y gatos',
      descripcion: 'Espacios Cómodos, seguros y adaptados para la recuperación de tu mascota.'
    },
    {
      imagen: '/images/landing/servicios/monitoreo.jpg',
      titulo: 'Monitoreo médico continuo',
      descripcion: 'Vigilancia constante de signos vitales y estado de salud las 24 horas.'
    },
    {
      imagen: '/images/landing/servicios/administracion.jpg',
      titulo: 'Administración de tratamientos',
      descripcion: 'Medicamentos y terapias administrados por profesionales con precisión.'
    },
    {
      imagen: '/images/landing/servicios/supervision.jpg',
      titulo: 'Supervisión veterinaria permanente',
      descripcion: 'Nuestro equipo veterinario supervisa cada etapa de la recuperación.'
    },
    {
      imagen: '/images/landing/servicios/espacios.jpg',
      titulo: 'Espacios de recuperación',
      descripcion: 'Instalaciones limpias, climatizadas y diseñadas para el confort animal.'
    },
    {
      imagen: '/images/landing/servicios/comunicacion.jpg',
      titulo: 'Comunicación con dueños',
      descripcion: 'Te mantenemos informado del estado de tu mascota en todo momento.'
    }
  ];
  
}
