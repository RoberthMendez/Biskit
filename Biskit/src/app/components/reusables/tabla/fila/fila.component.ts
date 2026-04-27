import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TablaAction, TablaActionClickEvent, TablaFilaClickEvent } from '../tabla.types';

@Component({
  selector: 'tr[app-fila]',
  imports: [],
  templateUrl: './fila.component.html'
})
export class FilaComponent {

  @Input() celdas: unknown[] = [];

  @Input() alineaciones: Array<'left' | 'center' | 'right'> = [];

  @Input() filaOriginal: unknown;

  @Input() filaIndex = 0;

  @Output() filaClick = new EventEmitter<TablaFilaClickEvent>();

  @Output() accionClick = new EventEmitter<TablaActionClickEvent>();

  public onFilaClick(): void {
    this.filaClick.emit({ row: this.filaOriginal, rowIndex: this.filaIndex });
  }

  public onAccionClick(event: MouseEvent, actionId: string): void {
    event.stopPropagation();
    this.accionClick.emit({
      actionId,
      row: this.filaOriginal,
      rowIndex: this.filaIndex,
    });
  }

  public isImageCell(celda: unknown): celda is {
    kind: 'image';
    src: string;
    alt: string;
    fallback: string;
  } {
    return this.tieneTipo(celda, 'image');
  }

  public isBadgeCell(celda: unknown): celda is {
    kind: 'badge';
    label: string;
    className: string;
  } {
    return this.tieneTipo(celda, 'badge');
  }

  public isActionsCell(celda: unknown): celda is {
    kind: 'actions';
    actions: TablaAction[];
  } {
    return this.tieneTipo(celda, 'actions');
  }

  private tieneTipo(celda: unknown, kind: 'image' | 'badge' | 'actions'): boolean {
    return (
      celda !== null &&
      typeof celda === 'object' &&
      'kind' in celda &&
      (celda as { kind?: string }).kind === kind
    );
  }

}
