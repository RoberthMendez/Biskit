import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-acceso-rapido',
  imports: [],
  templateUrl: './item-acceso-rapido.component.html'
})
export class ItemAccesoRapidoComponent {

  @Input() titulo: string = '';
  @Input() vetId: number = 0;

  constructor(private router: Router) {}

  navigateToAdd(): void {
    const routeSegment = this.getRouteSegmentForTitulo(this.titulo);
    if (!routeSegment || !this.vetId) {
      return;
    }

    this.router.navigate(['/vet', this.vetId, routeSegment, 'add']);
  }

  private getRouteSegmentForTitulo(titulo: string): string {
    switch (titulo?.toLowerCase()) {
      case 'mascota':
        return 'mascota';
      case 'cliente':
        return 'cliente';
      case 'tratamiento':
        return 'tratamiento';
      default:
        return '';
    }
  }

}
