import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarScrollCloseService } from '../../../services/navbar-scroll-close.service';

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
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navToggle') navToggle?: ElementRef<HTMLInputElement>;
  @Input() options: NavbarOption[] = [];
  @Input() sticky = false;
  @Input() brandRoute: string | Array<string | number> = '/';

  private scrollCloseSubscription?: Subscription;

  constructor(private navbarScrollCloseService: NavbarScrollCloseService) {}

  ngOnInit(): void {
    this.scrollCloseSubscription =
      this.navbarScrollCloseService.scroll$.subscribe(() =>
        this.closeMobileNav(),
      );
  }

  closeMobileNav(): void {
    const toggle = this.navToggle?.nativeElement;

    if (!toggle) {
      return;
    }

    toggle.checked = false;
  }

  ngOnDestroy(): void {
    this.scrollCloseSubscription?.unsubscribe();
  }

  isAnchorRoute(route: NavbarOption['route']): boolean {
    return typeof route === 'string' && route.startsWith('#');
  }

  isButton(option: NavbarOption): boolean {
    return option.variant === 'button';
  }
}
