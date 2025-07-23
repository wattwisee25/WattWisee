import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlossaryComponent } from './glossary/glossary';
import { HomeComponent } from './home/home';
import { ChecklistComponent } from './checklist/checklist';
import { EnergyComponent } from './energy/energy';
import { ForecastComponent } from './forecast/forecast';
import { RecommendedComponent } from './recommended/recommended';
import { RenewableComponent } from './renewable/renewable';
import { LoginComponent } from './login/login';
import { SignInComponent } from './sign-in/sign-in';
import { AccessComponent } from './access/access';

export const routes: Routes = [
    { path: '', component: AccessComponent },          
    { path: 'login', component: LoginComponent },          // pagina di login
    { path: 'sign-in', component: SignInComponent},
    { path: 'home', component: HomeComponent },          // pagina Home
    { path: 'glossary', component: GlossaryComponent },
    { path: 'checklist', component: ChecklistComponent },
    { path: 'energy', component: EnergyComponent },
    { path: 'forecast', component: ForecastComponent },
    { path: 'recommended', component: RecommendedComponent },
    { path: 'Renewable', component: RenewableComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


