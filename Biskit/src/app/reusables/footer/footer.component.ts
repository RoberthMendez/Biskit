import { Component } from '@angular/core';
import { CalidadComponent } from "./calidad/calidad.component";
import { MarcaComponent } from './marca/marca.component';
import { CompromisoComponent } from './compromiso/compromiso.component';
import { RedesComponent } from './redes/redes.component';

@Component({
  selector: 'app-footer',
  imports: [MarcaComponent, CompromisoComponent, CalidadComponent, RedesComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {

}
