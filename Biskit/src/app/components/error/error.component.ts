import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [RouterLink],
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  mensaje: string = 'La página no fue encontrada';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.mensaje = params['mensaje'] || 'La página no fue encontrada';
    });
  }
}
