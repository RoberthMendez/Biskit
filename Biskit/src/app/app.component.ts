import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/reusables/footer/footer.component';
import { HeaderComponent } from './components/reusables/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Biskit';
  mostrarHeader = false;

  constructor(router: Router) {
    router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        const ruta = router.url;
        this.mostrarHeader =
          ruta !== '/' &&
          ruta !== '/#hero' &&
          ruta !== '/#sobre-biskit' &&
          ruta !== '/#servicios' &&
          ruta !== '/#proceso' &&
          ruta !== '/#contacto' &&
          !ruta.startsWith('/login') &&
          !ruta.startsWith('/error');

        // -------------------------
        // Guardar authRole + authId
        // -------------------------

        const segmentos = ruta.split('/').filter(Boolean);

        if (segmentos.length >= 2) {
          const rol = segmentos[0];
          const id = segmentos[1];

          if (rol === 'vet') {
            localStorage.setItem('authRole', 'VETERINARIO');
            localStorage.setItem('authId', id);
          }

          if (rol === 'client') {
            localStorage.setItem('authRole', 'CLIENTE');
            localStorage.setItem('authId', id);
          }

          if (rol === 'admin') {
            localStorage.setItem('authRole', 'ADMIN');
            localStorage.setItem('authId', id);
          }
        }
      });
  }
}
