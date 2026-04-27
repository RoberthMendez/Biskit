import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-clients-header',
  imports: [RouterLink],
  templateUrl: './clients-header.component.html',
})
export class ClientsHeaderComponent {
  @Input() backRoute: string | Array<string | number> = '/vet';
  @Input() addRoute: string | Array<string | number> = '/vet/clients/add';
  @Input() panelTitle = 'Panel de Veterinario';
}
