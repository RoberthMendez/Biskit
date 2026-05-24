import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './components/reusables/footer/footer.component';
import { HeaderComponent } from './components/reusables/header/header.component';
import { NavbarScrollCloseService } from './services/navbar-scroll-close.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Biskit';
  mostrarHeader = false;
  private scrollResetTimerIds: number[] = [];

  constructor(
    router: Router,
    private navbarScrollCloseService: NavbarScrollCloseService,
  ) {
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

        this.resetScrollAfterNavigation(ruta);
      });
  }

  onAppShellScroll(): void {
    this.navbarScrollCloseService.notifyScroll();
  }

  private resetScrollAfterNavigation(ruta: string): void {
    if (ruta.includes('#')) {
      return;
    }

    this.scrollResetTimerIds.forEach((timerId) => window.clearTimeout(timerId));
    this.scrollResetTimerIds = [];

    this.scrollAppToTop();

    [0, 50, 150].forEach((delay) => {
      const timerId = window.setTimeout(() => {
        this.scrollAppToTop();
      }, delay);

      this.scrollResetTimerIds.push(timerId);
    });
  }

  private scrollAppToTop(): void {
    const appShell = document.querySelector<HTMLElement>('.app-shell');

    appShell?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
}
