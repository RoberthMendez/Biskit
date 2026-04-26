import { Component, Input } from '@angular/core';
import { TablaComponent } from "../../../reusables/tabla/tabla.component";

@Component({
  selector: 'app-card-tabla',
  imports: [TablaComponent],
  templateUrl: './card-tabla.component.html'
})
export class CardTablaComponent {

  @Input() datos: any[] = [];

}
