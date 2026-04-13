import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-clients-header',
  imports: [RouterLink],
  templateUrl: './clients-header.component.html',
})
export class ClientsHeaderComponent {}
