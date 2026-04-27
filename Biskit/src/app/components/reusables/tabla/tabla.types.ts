export interface TablaBadgeConfig {
  label: string;
  className?: string;
}

export interface TablaAction {
  id: string;
  label: string;
  className?: string;
  icon?: 'edit' | 'delete';
  showLabel?: boolean;
}

export interface TablaColumna {
  header: string;
  key?: string;
  accessor?: (fila: unknown) => unknown;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'image' | 'badge' | 'actions';
  imageAlt?: string;
  imageFallback?: string;
  badgeMap?: Record<string, TablaBadgeConfig>;
  actions?: TablaAction[];
}

export interface TablaFilaClickEvent {
  row: unknown;
  rowIndex: number;
}

export interface TablaActionClickEvent {
  actionId: string;
  row: unknown;
  rowIndex: number;
}

export type TablaColumnaInput = string | TablaColumna;
