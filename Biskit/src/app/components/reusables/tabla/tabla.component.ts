import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilaComponent } from './fila/fila.component';
import {
  TablaActionClickEvent,
  TablaColumna,
  TablaColumnaInput,
  TablaFilaClickEvent,
} from './tabla.types';

@Component({
  selector: 'app-tabla',
  imports: [FilaComponent],
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css'],
  host: {
    class: 'block w-full',
  },
})
export class TablaComponent {
  @Input() showOnMobile = false;

  @Input() maxHeight: string | null = null;

  @Input() columnas: TablaColumnaInput[] = [];

  @Input() datos: unknown[] = [];

  @Output() rowClick = new EventEmitter<TablaFilaClickEvent>();

  @Output() actionClick = new EventEmitter<TablaActionClickEvent>();

  public get columnasNormalizadas(): TablaColumna[] {
    const keysBase = this.obtenerKeysBase();

    if (this.columnas.length === 0) {
      return this.inferirColumnasDesdeDatos();
    }

    return this.columnas.map((columna, index) => {
      if (typeof columna === 'string') {
        return {
          header: columna,
          key: keysBase[index],
        };
      }

      return columna;
    });
  }

  public get filasNormalizadas(): unknown[][] {
    const columnas = this.columnasNormalizadas;

    return this.datos.map((fila) =>
      columnas.map((columna, index) => {
        const valor = this.obtenerValorCelda(fila, columna, index);
        return this.normalizarCelda(valor, columna);
      }),
    );
  }

  public get alineacionesColumnas(): Array<'left' | 'center' | 'right'> {
    const columnas = this.columnasNormalizadas;

    return columnas.map((columna, index) => {
      if (columna.align) {
        return columna.align;
      }

      const muestra = this.datos
        .slice(0, 20)
        .map((fila) => this.obtenerValorCelda(fila, columna, index))
        .filter(
          (valor) => valor !== null && valor !== undefined && valor !== '',
        );

      if (muestra.length === 0) {
        return 'left';
      }

      const esNumerica = muestra.every((valor) => {
        if (typeof valor === 'number') {
          return true;
        }

        if (typeof valor === 'string') {
          const limpio = valor.trim();
          return limpio.length > 0 && !Number.isNaN(Number(limpio));
        }

        return false;
      });

      return esNumerica ? 'right' : 'left';
    });
  }

  private inferirColumnasDesdeDatos(): TablaColumna[] {
    const primeraFila = this.datos[0];

    if (primeraFila === null || primeraFila === undefined) {
      return [];
    }

    if (Array.isArray(primeraFila)) {
      return primeraFila.map((_, index) => ({
        header: `Columna ${index + 1}`,
      }));
    }

    if (typeof primeraFila === 'object') {
      return Object.keys(primeraFila as Record<string, unknown>).map((key) => ({
        header: this.formatearHeader(key),
        key,
      }));
    }

    return [{ header: 'Valor' }];
  }

  private obtenerKeysBase(): string[] {
    const primeraFila = this.datos[0];

    if (
      primeraFila &&
      typeof primeraFila === 'object' &&
      !Array.isArray(primeraFila)
    ) {
      return Object.keys(primeraFila as Record<string, unknown>);
    }

    return [];
  }

  private obtenerValorCelda(
    fila: unknown,
    columna: TablaColumna,
    index: number,
  ): unknown {
    if (columna.accessor) {
      return columna.accessor(fila);
    }

    if (fila === null || fila === undefined) {
      return '';
    }

    if (Array.isArray(fila)) {
      return fila[index] ?? '';
    }

    if (typeof fila === 'object') {
      const registro = fila as Record<string, unknown>;

      if (columna.key && columna.key in registro) {
        return registro[columna.key];
      }

      const keyFallback = this.obtenerKeysBase()[index];
      return keyFallback ? (registro[keyFallback] ?? '') : '';
    }

    return index === 0 ? fila : '';
  }

  private formatearHeader(key: string): string {
    return key
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (letra) => letra.toUpperCase());
  }

  public onFilaClick(event: TablaFilaClickEvent): void {
    this.rowClick.emit(event);
  }

  public onActionClick(event: TablaActionClickEvent): void {
    this.actionClick.emit(event);
  }

  private normalizarCelda(valor: unknown, columna: TablaColumna): unknown {
    switch (columna.type) {
      case 'image': {
        const src = typeof valor === 'string' ? valor : '';

        return {
          kind: 'image',
          src,
          alt: columna.imageAlt ?? columna.header,
          fallback: columna.imageFallback ?? '/images/add-vet/default-vet.png',
        };
      }
      case 'badge': {
        const key = String(valor);
        const badge = columna.badgeMap?.[key];

        return {
          kind: 'badge',
          label: badge?.label ?? key,
          className:
            badge?.className ??
            'bg-[#EAE6E1] text-[#4A4A4A] border border-[#DCD6CF]',
        };
      }
      case 'actions':
        return {
          kind: 'actions',
          actions: columna.actions ?? [],
        };
      default:
        return valor;
    }
  }
}
