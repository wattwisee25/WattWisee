import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlossaryComponent } from './glossary/glossary';
import { ChecklistComponent } from './checklist/checklist';
import { LoginComponent } from './login/login';
import { CreateAccountComponent } from './create-account/create-account';
import { AccessComponent } from './access/access';
import { NewProjectComponent } from './new-project/new-project';
import { UploadBillComponent } from './upload-bill/upload-bill';
import { ProfileComponent } from './profile/profile';
import { PersonalDataComponent } from './personal-data/personal-data';
import { SettingComponent} from './setting/setting';


export const routes: Routes = [
    { path: '', component: AccessComponent },          
    { path: 'login', component: LoginComponent },
    { path: 'create-account', component: CreateAccountComponent},
    { path: 'create-new-project', component: NewProjectComponent }, 
    { path: 'upload-bills', component: UploadBillComponent },
    { path: 'glossary', component: GlossaryComponent },
    { path: 'checklist', component: ChecklistComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'personal-data', component: PersonalDataComponent },
    { path: 'settings', component: SettingComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


