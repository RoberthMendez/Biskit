import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'vet/pet/add',
    loadComponent: () =>
      import('./vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
];
