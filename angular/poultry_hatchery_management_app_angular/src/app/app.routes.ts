import { NavbarComponent } from './components/navbar/navbar.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ManagerComponent } from './components/manager/manager.component';
import { DeliveriesComponent } from './components/deliveries/deliveries.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { IncubatorsComponent } from './components/incubators/incubators.component';
import { NestingIncubatorComponent } from './components/incubators/nesting-incubator/nesting-incubator.component';
import { HatchingIncubatorComponent } from './components/incubators/hatching-incubator/hatching-incubator.component';
import { CandlingComponent } from './components/candling/candling.component';

export const routes: Routes = [
    { path: '', component: NavbarComponent,
        children: [
            { path: 'manager', component: ManagerComponent},
            { path: 'deliveries', component: DeliveriesComponent},
            { path: 'tasks', component: TasksComponent},
            { path: 'incubators', component: IncubatorsComponent},
            { path: 'incubators/nesting', component: NestingIncubatorComponent},
            { path: 'incubators/hatching', component: HatchingIncubatorComponent},
            { path: 'candling', component: CandlingComponent}
        ],
    },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: '**', redirectTo: 'home'}

];
