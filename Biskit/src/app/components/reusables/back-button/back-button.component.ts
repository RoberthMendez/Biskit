import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [RouterLink],
  templateUrl: './back-button.component.html'
})
export class BackButtonComponent {

  @Input() label: String = '';

  @Input() ruta: Array<string | number> = ['..'];

}
