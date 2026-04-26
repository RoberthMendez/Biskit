import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/landing/landing.component').then(
        (m) => m.LandingComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets',
    loadComponent: () =>
      import('./components/vet/pet/pets/pets.component').then(
        (m) => m.PetsComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/update/:petId',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/:petId',
    loadComponent: () =>
      import('./components/vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/:petId/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'vet/:vetId/pets/:petId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/:vetId/clients',
    loadComponent: () =>
      import('./components/vet/client/clients/clients.component').then(
        (m) => m.ClientsComponent,
      ),
  },
  {
    path: 'vet/:vetId/clients/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/:vetId/clients/update/:id',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/:vetId/clients/:id',
    loadComponent: () =>
      import('./components/vet/client/info-client/info-client.component').then(
        (m) => m.InfoClientComponent,
      ),
  },
  {
    path: 'client/:id',
    loadComponent: () =>
      import('./components/client/client/client.component').then(
        (m) => m.ClientComponent,
      ),
  },
  {
    path: 'client/:clientId/pet/:petId',
    loadComponent: () =>
      import('./components/client/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'client/:clientId/pet/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
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
    path: 'admin/:idAdmin/vets',
    loadComponent: () =>
      import('./components/admin/vet/vets/vets.component').then(
        (m) => m.VetsComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets',
    loadComponent: () =>
      import('./components/vet/pet/pets/pets.component').then(
        (m) => m.PetsComponent,
      ),
  },
  {
    path: 'admin/:id',
    loadComponent: () =>
      import('./components/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'admin/vets/:vetId',
    loadComponent: () =>
      import('./components/admin/vet/info-vet/info-vet.component').then(
        (m) => m.InfoVetComponent,
      ),
  },
  {
    path: 'vet/:id',
    loadComponent: () =>
      import('./components/vet/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
];
