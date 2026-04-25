import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TratamientoMesDto } from '../../../../models/dtos/tratamiento-mes-dto';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-card-barras',
  imports: [ChartModule],
  templateUrl: './card-barras.component.html'
})
export class CardBarrasComponent implements OnChanges {

  dataBarras: any;
  options: any;

  @Input() tratamientos: TratamientoMesDto[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tratamientos']) {
      this.crearBarras();
    }
  }

  private crearBarras() {

    const labels = this.tratamientos.map(t => t.mes);
    const valores = this.tratamientos.map(t => t.numTratamientos);
    const maxVal = Math.max(...valores);

    this.dataBarras = {
      labels,
      datasets: [{
        data: valores,
        backgroundColor: valores.map(v => v === maxVal ? '#2b5392' : '#92aed1'),
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
      }]
    };

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          borderColor: '#E0E0E0',
          borderWidth: 1,
          titleColor: '#8d8580',
          bodyColor: '#2b3a4a',
          bodyFont: { size: 14, weight: '500' },
          cornerRadius: 8,
          callbacks: {
            label: (ctx: any) => ` ${ctx.parsed.y} tratamientos`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#8d8580', font: { size: 12, weight: '500' } }
        },
        y: {
          grid: { color: '#ece9e4' },
          border: { display: false },
          beginAtZero: true,
          ticks: {
            color: '#8d8580',
            font: { size: 11 },
            maxTicksLimit: 5,
            callback: (v: number) => Math.round(v)
          }
        }
      }
    };
  }
}