import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { ContactoComponent } from './contacto/contacto.component';
import { CtaComponent } from './cta/cta.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PorQueComponent } from './por-que/por-que.component';
import { ProcesoComponent } from './proceso/proceso.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { SobreBiskitComponent } from './sobre-biskit/sobre-biskit.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroBannerComponent,
    CaracteristicasComponent,
    SobreBiskitComponent,
    ServiciosComponent,
    ProcesoComponent,
    PorQueComponent,
    CtaComponent,
    ContactoComponent,
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private observer: IntersectionObserver | null = null;
  private timeoutIds: number[] = [];
  private rafIds: number[] = [];

  ngAfterViewInit(): void {
    const windowRef = this.document.defaultView;
    if (!windowRef) {
      return;
    }

    const prefersReducedMotion = windowRef.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      this.document.body.classList.add('hero-ready');
    } else {
      const firstRaf = windowRef.requestAnimationFrame(() => {
        const secondRaf = windowRef.requestAnimationFrame(() => {
          this.document.body.classList.add('hero-ready');
        });
        this.rafIds.push(secondRaf);
      });
      this.rafIds.push(firstRaf);
    }

    const selectors = [
      '#sobre-biskit > article',
      '#sobre-biskit + section > article',
      '#servicios > p',
      '#servicios > h2',
      '#servicios > article > app-card',
      '#servicios > article > div',
      '#proceso > p',
      '#proceso > h2',
      '#proceso article .paso-numero',
      '#por-que > div',
      '#razones > div',
      '#cta > *',
      '#contacto > *',
    ];

    const animationTargets = selectors.flatMap((selector) =>
      Array.from(this.document.querySelectorAll<HTMLElement>(selector)),
    );

    if (!animationTargets.length) {
      return;
    }

    if (prefersReducedMotion) {
      animationTargets.forEach((element) =>
        element.classList.add('is-visible'),
      );
      return;
    }

    animationTargets.forEach((element) => element.classList.add('reveal-up'));

    const STAGGER_MS = 55;
    const REVEAL_TRANSITION =
      'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)';

    this.observer = new windowRef.IntersectionObserver(
      (entries, currentObserver) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (!intersecting.length) {
          return;
        }

        intersecting
          .sort((a, b) =>
            a.target.compareDocumentPosition(b.target) &
            windowRef.Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1,
          )
          .forEach((entry, index) => {
            const element = entry.target as HTMLElement;
            currentObserver.unobserve(element);

            const revealTimeoutId = windowRef.setTimeout(() => {
              element.style.transition = REVEAL_TRANSITION;
              element.classList.add('is-visible');

              const cleanupTimeoutId = windowRef.setTimeout(() => {
                element.style.transition = '';
                element.classList.remove('reveal-up');
              }, 700);

              this.timeoutIds.push(cleanupTimeoutId);
            }, index * STAGGER_MS);

            this.timeoutIds.push(revealTimeoutId);
          });
      },
      { threshold: 0, rootMargin: '0px 0px -30px 0px' },
    );

    animationTargets.forEach((element) => this.observer?.observe(element));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;

    const windowRef = this.document.defaultView;

    if (windowRef) {
      this.timeoutIds.forEach((timeoutId) => windowRef.clearTimeout(timeoutId));
      this.rafIds.forEach((rafId) => windowRef.cancelAnimationFrame(rafId));
    }

    this.timeoutIds = [];
    this.rafIds = [];
  }
}
