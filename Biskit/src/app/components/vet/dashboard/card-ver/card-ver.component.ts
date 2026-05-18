import { Component, Input } from '@angular/core';
//RouterLink
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-ver',
  imports: [RouterLink],
  templateUrl: './card-ver.component.html',
})
export class CardVerComponent {
  @Input() titulo: string = '';
}
