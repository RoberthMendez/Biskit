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
  mostrarHeader = true;

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
          ruta !== '/' && ruta !== '/login' && !ruta.startsWith('/error');
        window.scrollTo(0, 0);
      });
  }
}
