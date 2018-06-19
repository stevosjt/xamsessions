import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './app/register/register.component';
import { LoginComponent } from './app/login/login.component';
import { HomeComponent } from './app/home/home.component';
import { AuthGuard } from 'library';

export const APP_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        data: {
            customLayout: true
          }
    },
    {
        path: 'register/:registrationId',
        component: RegisterComponent,
        data: {
            customLayout: true
          }
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    }
];


@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
