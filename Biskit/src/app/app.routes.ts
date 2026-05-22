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
    path: 'vet/pets',
    loadComponent: () =>
      import('./components/vet/pet/pets/pets.component').then(
        (m) => m.PetsComponent,
      ),
  },
  {
    path: 'vet/pets/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/mascota/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
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
    path: 'vet/cliente/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'vet/tratamientos/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/pets/update/:petId',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'vet/pets/:petId',
    loadComponent: () =>
      import('./components/vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'vet/pets/:petId/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/pets/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'vet/pets/:petId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
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
  {
    path: 'vet/add-cita',
    loadComponent: () =>
      import('./components/vet/citas/add-cita/add-cita.component').then(
        (m) => m.AddCitaComponent,
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
    path: 'client/pet/:petId',
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
    path: 'client/pet/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'admin/vets',
    loadComponent: () =>
      import('./components/admin/vet/vets/vets.component').then(
        (m) => m.VetsComponent,
      ),
  },
  {
    path: 'admin/clients',
    loadComponent: () =>
      import('./components/vet/client/clients/clients.component').then(
        (m) => m.ClientsComponent,
      ),
  },
  {
    path: 'admin/clients/add',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'admin/clients/update/:id',
    loadComponent: () =>
      import('./components/vet/client/add-client/add-client.component').then(
        (m) => m.AddClientComponent,
      ),
  },
  {
    path: 'admin/clients/:id',
    loadComponent: () =>
      import('./components/vet/client/info-client/info-client.component').then(
        (m) => m.InfoClientComponent,
      ),
  },
  {
    path: 'admin/vets/add',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'admin/vets/update/:idVet',
    loadComponent: () =>
      import('./components/admin/vet/add-vet/add-vet.component').then(
        (m) => m.AddVetComponent,
      ),
  },
  {
    path: 'admin/pets',
    loadComponent: () =>
      import('./components/vet/pet/pets/pets.component').then(
        (m) => m.PetsComponent,
      ),
  },
  {
    path: 'admin/pets/add',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'admin/pets/update/:petId',
    loadComponent: () =>
      import('./components/vet/pet/add-pet/add-pet.component').then(
        (m) => m.AddPetComponent,
      ),
  },
  {
    path: 'admin/pets/:petId',
    loadComponent: () =>
      import('./components/vet/pet/info-pet/info-pet.component').then(
        (m) => m.InfoPetComponent,
      ),
  },
  {
    path: 'admin/pets/:petId/tratamiento/add',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'admin/pets/:petId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'admin/pets/:petId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
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
    path: 'admin/vets/:vetId/tratamiento/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/info-tratamiento/info-tratamiento.component').then(
        (m) => m.InfoTratamientoComponent,
      ),
  },
  {
    path: 'admin/vets/:vetId/tratamiento/update/:tratamientoId',
    loadComponent: () =>
      import('./components/tratamientos/add-tratamiento/add-tratamiento.component').then(
        (m) => m.AddTratamientoComponent,
      ),
  },
  {
    path: 'vet/tratamientos/:tratamientoId',
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
