import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-login-input',
  imports: [],
  templateUrl: './input.component.html'
})
export class LoginInputComponent {
  @Input() label!: string;
  @Input() inputId!: string;
  @Input() inputName!: string;
  @Input() value: string = '';
  @Input() type: string = 'text';
}
