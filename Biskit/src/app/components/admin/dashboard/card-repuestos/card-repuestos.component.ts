import { Component, Input } from '@angular/core';
import { StockDrogaDto } from '../../../../models/dtos/stock-droga-dto';

@Component({
  selector: 'app-card-repuestos',
  imports: [],
  templateUrl: './card-repuestos.component.html'
})
export class CardRepuestosComponent {

  @Input() drogas: StockDrogaDto[] = [];

  ngOnChanges(){
    this.ordenarDrogas()
  }

  ordenarDrogas(){
    this.drogas.sort((a, b) => a.stockActual - b.stockActual);
  }

  sinStock(droga: StockDrogaDto): boolean {
    return droga.stockActual === 0;
  }


}
