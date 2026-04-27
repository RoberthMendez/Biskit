import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BackButtonComponent } from '../../../../reusables/back-button/back-button.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Input() adminId: number = 0;

}
