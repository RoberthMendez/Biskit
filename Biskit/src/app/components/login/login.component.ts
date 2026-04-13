import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/form.component';
import { HeaderComponent } from './login-header/header.component';
import { ImageComponent } from './login-image/image.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [HeaderComponent, LoginFormComponent, ImageComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {

}
