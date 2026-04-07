import { Component } from '@angular/core';
import { VolverComponent } from './components/volver/volver.component';
import { ImagenComponent } from './components/imagen/imagen.component';
import { ClientFormComponent } from './components/form/form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-client',
  imports: [VolverComponent, ClientFormComponent, ImagenComponent],
  templateUrl: './add-client.component.html',
})
export class AddClientComponent {
  clientId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.clientId = id ? Number(id) : null;
  }
}
