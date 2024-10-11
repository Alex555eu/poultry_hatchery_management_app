import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagerComponent } from './components/manager/manager.component';

export const routes: Routes = [
    { path: '', component: NavbarComponent,
        children: [
            { path: 'manager', component: ManagerComponent}
        ],
    },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', redirectTo: 'home'}

];
