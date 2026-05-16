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
    path: 'vet/:vetId/mascota/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
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
    path: 'vet/:vetId/cliente/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/:vetId/tratamientos/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/:vetId/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
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
    path: 'client',
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
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
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
    path: 'admin/:idAdmin/vets',
    loadComponent: () =>
      import('./components/admin/vet/vets/vets.component').then(
        (m) => m.VetsComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/clients',
    loadComponent: () =>
      import('./components/vet/client/clients/clients.component').then(
        (m) => m.ClientsComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/clients/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/clients/update/:id',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/clients/:id',
    loadComponent: () =>
      import('./components/vet/client/info-client/info-client.component').then(
        (m) => m.InfoClientComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/vets/add',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/vets/update/:idVet',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
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
    path: 'admin/:idAdmin/pets/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets/update/:petId',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets/:petId',
    loadComponent: () =>
      import('./components/vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets/:petId/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/pets/:petId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/vets/:vetId',
    loadComponent: () =>
      import('./components/admin/vet/info-vet/info-vet.component').then(
        (m) => m.InfoVetComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/vets/:vetId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'admin/:idAdmin/vets/:vetId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/:vetId/tratamientos/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'vet',
    loadComponent: () =>
      import('./components/vet/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: 'login/reset-password/:id',
    loadComponent: () =>
      import('./components/password/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'login/forgot-password',
    loadComponent: () =>
      import('./components/password/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./components/error/error.component').then(
        (m) => m.ErrorComponent,
      ),
  },
  { path: '**', redirectTo: 'error' },
];
