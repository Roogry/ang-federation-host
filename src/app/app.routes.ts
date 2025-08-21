import { Routes } from '@angular/router';
import { ProfileLocationPageComponent } from './pages/profile-location-page/profile-location-page.component';
import { loadRemoteModule } from '@angular-architects/native-federation';
// import { loadRemoteComponent } from './utils/federation-utils';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () =>
      loadRemoteModule('ang-federation-remote', './Profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'edit-location',
    component: ProfileLocationPageComponent,
  },
];
