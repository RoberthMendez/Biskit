import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'vet/pets/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets/update',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets/update/:id',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets',
    loadComponent: () =>
      import('./components/vet/pet/pets/pets.component').then((m) => m.PetsComponent),
  },
  {
    path: 'vet/pets/:id',
    loadComponent: () =>
      import('./components/vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'admin/vet/add',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'admin/vet/update/:id',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'vet/clients',
    loadComponent: () =>
      import('./components/vet/client/clients/clients.component').then(
        (m) => m.ClientsComponent,
      ),
  },
  {
    path: 'vet/clients/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/clients/update/:id',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/clients/:id',
    loadComponent: () =>
      import('./components/vet/client/info-client/info-client.component').then(
        (m) => m.InfoClientComponent,
      ),
  },
];
