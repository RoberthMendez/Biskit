import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
})
export class ErrorComponent {

  mensaje: string = 'Ocurrió un error desconocido';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.mensaje = params['mensaje'] || 'Ocurrió un error desconocido';
    });
  }
}
