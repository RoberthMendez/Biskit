import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarScrollCloseService {
  private readonly scrollSubject = new Subject<void>();

  readonly scroll$ = this.scrollSubject.asObservable();

  notifyScroll(): void {
    this.scrollSubject.next();
  }
}
