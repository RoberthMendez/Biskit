import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {
  errorMessage: string | null = null;

  formData = {
    nombre: '',
    ownerNombre: '',
    especie: '',
    razaNombre: '',
    enfermedadNombre: '',
    fechaNacimiento: '',
    urlFoto: '',
    peso: 0
  };

  onSubmit() {
    const v = this.formData;

    if (!v.nombre.trim()) { this.errorMessage = 'Nombre requerido'; return; }
    if (!v.ownerNombre.trim()) { this.errorMessage = 'Dueño requerido'; return; }

    console.log('Formulario enviado:', v);
  }


}
