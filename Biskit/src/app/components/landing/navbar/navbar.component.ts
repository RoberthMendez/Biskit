import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @ViewChild('navToggle') navToggle?: ElementRef<HTMLInputElement>;

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

}
