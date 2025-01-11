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
import { OpenCandlingComponent } from './components/candling/open-candling/open-candling.component';
import { NestingComponent } from './components/nesting/nesting.component';
import { OpenNestingComponent } from './components/nesting/open-nesting/open-nesting.component';
import { HatchingComponent } from './components/hatching/hatching.component';
import { OpenHatchingComponent } from './components/hatching/open-hatching/open-hatching.component';
import { EmergenceComponent } from './components/emergence/emergence.component';
import { OpenEmergenceComponent } from './components/emergence/open-emergence/open-emergence.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

export const routes: Routes = [
    { path: '', component: NavbarComponent,
        children: [
            { path: 'manager', component: ManagerComponent},
            { path: 'deliveries', component: DeliveriesComponent},
            { path: 'tasks', component: TasksComponent},
            { path: 'incubators', component: IncubatorsComponent},

            { path: 'incubators/nesting', component: NestingIncubatorComponent},
            { path: 'incubators/hatching', component: HatchingIncubatorComponent},

            { path: 'candling', component: CandlingComponent},
            { path: 'candling/open', component: OpenCandlingComponent},
            
            { path: 'nesting', component: NestingComponent},
            { path: 'nesting/open', component: OpenNestingComponent},

            { path: 'hatching', component: HatchingComponent},
            { path: 'hatching/open', component: OpenHatchingComponent},

            { path: 'emergence', component: EmergenceComponent},
            { path: 'emergence/open', component: OpenEmergenceComponent},

            { path: 'activities', component: ActivitiesComponent},
        ],
    },
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'forbidden', component: ForbiddenComponent},
    { path: '**', redirectTo: 'home'}

];
