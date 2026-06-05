import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy, PLATFORM_ID } from '@angular/core';

type CampoLimpiable = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface CampoLimpiableState {
  host: HTMLElement;
  button: HTMLButtonElement;
  onInput: () => void;
  onMouseDown: (event: MouseEvent) => void;
  onClick: (event: MouseEvent) => void;
}

interface CampoLimpiableHostState {
  count: number;
  previousInlinePosition: string;
  positionWasStatic: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CamposLimpiablesService implements OnDestroy {
  private readonly excludedInputTypes = new Set([
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
  ]);

  private readonly campos = new Map<CampoLimpiable, CampoLimpiableState>();
  private readonly hosts = new Map<HTMLElement, CampoLimpiableHostState>();
  private observer: MutationObserver | null = null;
  private started = false;
  private rafId: number | null = null;

  private readonly onViewportChange = () => this.scheduleUpdate();
  private readonly onDocumentChange = () => this.scheduleScan();

  constructor(
    @Inject(DOCUMENT) private documentRef: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private zone: NgZone,
  ) {}

  start(): void {
    if (this.started || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const windowRef = this.documentRef.defaultView;
    if (!windowRef || !this.documentRef.body) {
      return;
    }

    this.started = true;

    this.zone.runOutsideAngular(() => {
      this.scan();

      this.observer = new MutationObserver(() => this.scheduleScan());
      this.observer.observe(this.documentRef.body, {
        childList: true,
        subtree: true,
      });

      windowRef.addEventListener('resize', this.onViewportChange, {
        passive: true,
      });
      windowRef.addEventListener('scroll', this.onViewportChange, true);

      this.documentRef.addEventListener('input', this.onDocumentChange, true);
      this.documentRef.addEventListener('change', this.onDocumentChange, true);
      this.documentRef.addEventListener('click', this.onDocumentChange, true);
      this.documentRef.addEventListener('keyup', this.onDocumentChange, true);
    });
  }

  stop(): void {
    if (!this.started || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const windowRef = this.documentRef.defaultView;

    this.observer?.disconnect();
    this.observer = null;

    if (this.rafId !== null && windowRef) {
      windowRef.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    windowRef?.removeEventListener('resize', this.onViewportChange);
    windowRef?.removeEventListener('scroll', this.onViewportChange, true);

    this.documentRef.removeEventListener('input', this.onDocumentChange, true);
    this.documentRef.removeEventListener('change', this.onDocumentChange, true);
    this.documentRef.removeEventListener('click', this.onDocumentChange, true);
    this.documentRef.removeEventListener('keyup', this.onDocumentChange, true);

    for (const campo of Array.from(this.campos.keys())) {
      this.detach(campo);
    }

    this.started = false;
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private scheduleScan(): void {
    this.schedule(() => this.scan());
  }

  private scheduleUpdate(): void {
    this.schedule(() => this.updateAll());
  }

  private schedule(callback: () => void): void {
    const windowRef = this.documentRef.defaultView;
    if (!windowRef) {
      return;
    }

    if (this.rafId !== null) {
      windowRef.cancelAnimationFrame(this.rafId);
    }

    this.rafId = windowRef.requestAnimationFrame(() => {
      this.rafId = null;
      callback();
    });
  }

  private scan(): void {
    this.detachStaleControls();

    const controls = this.documentRef.querySelectorAll<CampoLimpiable>(
      'input, textarea, select',
    );

    controls.forEach((campo) => {
      if (!this.campos.has(campo) && this.isClearableControl(campo)) {
        this.attach(campo);
      }
    });

    this.updateAll();
  }

  private attach(campo: CampoLimpiable): void {
    const host = this.getControlHost(campo);
    if (!host) {
      return;
    }

    const button = this.documentRef.createElement('button');
    button.type = 'button';
    button.className = 'biskit-clear-control-button';
    button.setAttribute('aria-label', 'Limpiar campo');
    button.setAttribute('title', 'Limpiar');
    button.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    `;

    const onInput = () => this.updateButton(campo);
    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
    };
    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      this.clearControl(campo);
    };

    this.registerHost(host);
    campo.classList.add('biskit-clearable-control');
    button.addEventListener('mousedown', onMouseDown);
    button.addEventListener('click', onClick);
    campo.addEventListener('input', onInput);
    campo.addEventListener('change', onInput);
    campo.addEventListener('focus', onInput);
    campo.addEventListener('blur', onInput);

    host.appendChild(button);
    this.campos.set(campo, { host, button, onInput, onMouseDown, onClick });
  }

  private detach(campo: CampoLimpiable): void {
    const state = this.campos.get(campo);
    if (!state) {
      return;
    }

    campo.classList.remove(
      'biskit-clearable-control',
      'biskit-clearable-control-with-action',
      'biskit-clearable-control-select',
      'biskit-clearable-control-date',
    );
    campo.removeEventListener('input', state.onInput);
    campo.removeEventListener('change', state.onInput);
    campo.removeEventListener('focus', state.onInput);
    campo.removeEventListener('blur', state.onInput);
    state.button.removeEventListener('mousedown', state.onMouseDown);
    state.button.removeEventListener('click', state.onClick);
    state.button.remove();
    this.campos.delete(campo);
    this.unregisterHost(state.host);
  }

  private detachStaleControls(): void {
    for (const campo of Array.from(this.campos.keys())) {
      if (
        !this.documentRef.body.contains(campo) ||
        !this.isClearableControl(campo)
      ) {
        this.detach(campo);
      }
    }
  }

  private updateAll(): void {
    for (const campo of this.campos.keys()) {
      this.updateButton(campo);
    }
  }

  private updateButton(campo: CampoLimpiable): void {
    const state = this.campos.get(campo);
    if (!state) {
      return;
    }

    const button = state.button;
    const host = state.host;
    const hasTrailingAction = this.hasTrailingAction(campo);

    campo.classList.toggle(
      'biskit-clearable-control-with-action',
      hasTrailingAction,
    );
    campo.classList.toggle(
      'biskit-clearable-control-select',
      campo instanceof HTMLSelectElement,
    );
    campo.classList.toggle(
      'biskit-clearable-control-date',
      campo instanceof HTMLInputElement && campo.type === 'date',
    );

    if (
      !this.hasValue(campo) ||
      campo.disabled ||
      this.isReadonly(campo) ||
      !this.isVisible(campo)
    ) {
      button.style.display = 'none';
      return;
    }

    const rect = campo.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const size = 24;
    const endOffset = this.getEndOffset(campo, hasTrailingAction);
    const left = rect.right - hostRect.left + host.scrollLeft - endOffset - size;
    const top = rect.top - hostRect.top + host.scrollTop + (rect.height - size) / 2;

    button.style.display = 'flex';
    button.style.left = `${Math.max(0, left)}px`;
    button.style.top = `${Math.max(0, top)}px`;
  }

  private clearControl(campo: CampoLimpiable): void {
    if (campo instanceof HTMLSelectElement) {
      campo.value = '';
      if (campo.value !== '') {
        campo.selectedIndex = -1;
      }
    } else {
      campo.value = '';
    }

    campo.dispatchEvent(new Event('input', { bubbles: true }));
    campo.dispatchEvent(new Event('change', { bubbles: true }));
    campo.focus({ preventScroll: true });
    this.updateButton(campo);
  }

  private isClearableControl(campo: CampoLimpiable): boolean {
    if (campo.dataset['clearable'] === 'false') {
      return false;
    }

    if (campo.closest('[data-clearable="false"]')) {
      return false;
    }

    if (this.hasOwnClearButton(campo)) {
      return false;
    }

    if (this.isSearchControl(campo)) {
      return false;
    }

    if (campo instanceof HTMLInputElement) {
      return !this.excludedInputTypes.has(campo.type.toLowerCase());
    }

    return true;
  }

  private isSearchControl(campo: CampoLimpiable): boolean {
    if (!(campo instanceof HTMLInputElement)) {
      return false;
    }

    const type = campo.type.toLowerCase();
    const placeholder =
      campo.getAttribute('placeholder')?.trim().toLowerCase() ?? '';

    return type === 'search' || placeholder.startsWith('buscar');
  }

  private hasOwnClearButton(campo: CampoLimpiable): boolean {
    const parent = campo.parentElement;
    if (!parent) {
      return false;
    }

    return Boolean(
      parent.querySelector(
        'button[aria-label^="Limpiar"]:not(.biskit-clear-control-button)',
      ),
    );
  }

  private hasTrailingAction(campo: CampoLimpiable): boolean {
    const parent = campo.parentElement;
    if (!parent) {
      return false;
    }

    return Boolean(
      parent.querySelector(
        'button:not(.biskit-clear-control-button):not([type="submit"])',
      ),
    );
  }

  private hasValue(campo: CampoLimpiable): boolean {
    return campo.value !== undefined && campo.value !== null && campo.value !== '';
  }

  private isReadonly(campo: CampoLimpiable): boolean {
    return (
      campo instanceof HTMLInputElement ||
      campo instanceof HTMLTextAreaElement
    ) && campo.readOnly;
  }

  private isVisible(campo: CampoLimpiable): boolean {
    const windowRef = this.documentRef.defaultView;
    if (!windowRef) {
      return false;
    }

    const rect = campo.getBoundingClientRect();
    const styles = windowRef.getComputedStyle(campo);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      styles.display !== 'none' &&
      styles.visibility !== 'hidden' &&
      !campo.closest('[hidden],[aria-hidden="true"]')
    );
  }

  private getEndOffset(campo: CampoLimpiable, hasTrailingAction: boolean): number {
    if (hasTrailingAction) {
      return 44;
    }

    if (campo instanceof HTMLSelectElement) {
      return 32;
    }

    if (campo instanceof HTMLInputElement && campo.type === 'date') {
      return 32;
    }

    return 4;
  }

  private getControlHost(campo: CampoLimpiable): HTMLElement | null {
    const parent = campo.parentElement;
    if (!parent) {
      return null;
    }

    if (parent.tagName.includes('-') && parent.parentElement) {
      return parent.parentElement;
    }

    return parent;
  }

  private registerHost(host: HTMLElement): void {
    const registered = this.hosts.get(host);
    if (registered) {
      registered.count += 1;
      return;
    }

    const windowRef = this.documentRef.defaultView;
    const positionWasStatic =
      windowRef?.getComputedStyle(host).position === 'static';

    this.hosts.set(host, {
      count: 1,
      previousInlinePosition: host.style.position,
      positionWasStatic,
    });

    host.classList.add('biskit-clear-control-host');

    if (positionWasStatic) {
      host.style.position = 'relative';
    }
  }

  private unregisterHost(host: HTMLElement): void {
    const registered = this.hosts.get(host);
    if (!registered) {
      return;
    }

    registered.count -= 1;

    if (registered.count > 0) {
      return;
    }

    host.classList.remove('biskit-clear-control-host');

    if (registered.positionWasStatic) {
      host.style.position = registered.previousInlinePosition;
    }

    this.hosts.delete(host);
  }
}
