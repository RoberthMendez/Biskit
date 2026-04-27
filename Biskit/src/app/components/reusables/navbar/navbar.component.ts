import { Component, ElementRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NavbarOption {
  label: string;
  route: string | Array<string | number>;
  variant?: 'link' | 'button';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnDestroy {
  @ViewChild('navToggle') navToggle?: ElementRef<HTMLInputElement>;
  @Input() options: NavbarOption[] = [];
  @Input() sticky = false;
  @Input() brandRoute: string | Array<string | number> = '/';

  private ignoreScroll = false;
  private ignoreScrollTimeoutId: ReturnType<typeof setTimeout> | null = null;

  onToggleChange(): void {
    this.ignoreScroll = true;

    if (this.ignoreScrollTimeoutId) {
      clearTimeout(this.ignoreScrollTimeoutId);
    }

    this.ignoreScrollTimeoutId = setTimeout(() => {
      this.ignoreScroll = false;
      this.ignoreScrollTimeoutId = null;
    }, 400);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const toggle = this.navToggle?.nativeElement;

    if (!toggle) {
      return;
    }

    if (!this.ignoreScroll && toggle.checked) {
      toggle.checked = false;
    }
  }

  ngOnDestroy(): void {
    if (this.ignoreScrollTimeoutId) {
      clearTimeout(this.ignoreScrollTimeoutId);
    }
  }

  isAnchorRoute(route: NavbarOption['route']): boolean {
    return typeof route === 'string' && route.startsWith('#');
  }

  isButton(option: NavbarOption): boolean {
    return option.variant === 'button';
  }

}