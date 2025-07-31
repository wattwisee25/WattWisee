import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlossaryComponent } from './glossary/glossary';
import { ChecklistComponent } from './checklist/checklist';
import { LoginComponent } from './login/login';
import { CreateAccountComponent } from './create-account/create-account';
import { AccessComponent } from './access/access';
import { NewProjectComponent } from './new-project/new-project';


export const routes: Routes = [
    { path: '', component: AccessComponent },          
    { path: 'login', component: LoginComponent },
    { path: 'create-account', component: CreateAccountComponent},
    { path: 'create-new-project', component: NewProjectComponent }, 
    { path: 'glossary', component: GlossaryComponent },
    { path: 'checklist', component: ChecklistComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


