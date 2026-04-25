import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-card-dona',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './card-dona.component.html'
})
export class CardDonaComponent {

  dataDona: any;
  options: any;

  @Input() titulo: string = '';

  @Input() total: number = 0;
  
  @Input() data: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.crearDona();
    }
  }

  private crearDona(){

    const activos = Number(this.data?.[0] ?? 0);
    const inactivos = Number(this.data?.[1] ?? 0);

    this.dataDona = {
      labels: ['Activos', 'Inactivos'],
      datasets: [
        {
          data: [activos, inactivos],
          backgroundColor: ['#E1F8EA', '#EDEDED'],
          borderWidth: 0,
          spacing: 3,
          hoverOffset: 3
        }
      ]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        }
      }
    };

  }


}
