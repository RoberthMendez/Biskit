import { Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/form.component';
import { HeaderComponent } from './components/login-header/header.component';
import { ImageComponent } from './components/login-image/image.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [HeaderComponent, LoginFormComponent, ImageComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {

}
