import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FiltrosEstadoService {
  private readonly storagePrefix = 'biskit:filtros:';

  guardar<T>(clave: string, valor: T): void {
    sessionStorage.setItem(this.storagePrefix + clave, JSON.stringify(valor));
  }

  obtener<T>(clave: string): T | null {
    const contenido = sessionStorage.getItem(this.storagePrefix + clave);
    if (!contenido) {
      return null;
    }

    try {
      return JSON.parse(contenido) as T;
    } catch {
      return null;
    }
  }

  eliminar(clave: string): void {
    sessionStorage.removeItem(this.storagePrefix + clave);
  }

  limpiarTodo(): void {
    const claves = Object.keys(sessionStorage);
    for (const clave of claves) {
      if (clave.startsWith(this.storagePrefix)) {
        sessionStorage.removeItem(clave);
      }
    }
  }
}