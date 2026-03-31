import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'vet/pets/add',
    loadComponent: () =>
      import('./vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets/update',
    loadComponent: () =>
      import('./vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets/update/:id',
    loadComponent: () =>
      import('./vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets',
    loadComponent: () =>
      import('./vet/pet/pets/pets.component').then((m) => m.PetsComponent),
  },
  {
    path: 'vet/pets/:id',
    loadComponent: () =>
      import('./vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'admin/vet/add',
    loadComponent: () =>
      import('./admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'admin/vet/update/:id',
    loadComponent: () =>
      import('./admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
];
