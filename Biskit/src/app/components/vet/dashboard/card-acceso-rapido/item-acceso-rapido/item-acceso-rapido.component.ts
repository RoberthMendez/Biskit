import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-acceso-rapido',
  imports: [],
  templateUrl: './item-acceso-rapido.component.html',
})
export class ItemAccesoRapidoComponent {
  @Input() titulo: string = '';

  constructor(private router: Router) {}

  navigateToAdd(): void {
    const routeSegment = this.getRouteSegmentForTitulo(this.titulo);
    if (!routeSegment) {
      return;
    }

    this.router.navigate(['/vet', routeSegment, 'add']);
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
