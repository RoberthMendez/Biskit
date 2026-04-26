export interface TablaColumna {
  header: string;
  key?: string;
  accessor?: (fila: unknown) => unknown;
  align?: 'left' | 'center' | 'right';
}

export type TablaColumnaInput = string | TablaColumna;
