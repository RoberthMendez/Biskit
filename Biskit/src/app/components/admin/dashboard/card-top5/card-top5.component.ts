import { Component, Input } from '@angular/core';
import { TopDto } from '../../../../models/dtos/top-dto';

@Component({
  selector: 'app-card-top5',
  imports: [],
  templateUrl: './card-top5.component.html'
})
export class CardTop5Component {

  @Input() top: TopDto[] | null = null;

  @Input() titulo: string = '';

  public tituloColumna: string = '';

  ngOnInit(): void {
    if(this.titulo === 'Drogas') {
      this.tituloColumna = 'UNID.';
    } else if(this.titulo === 'Enfermedades') {
      this.tituloColumna = 'CASOS';
    }
  }


  

}
