import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccessComponent } from './access/access';
import { LoginComponent } from './login/login';
import { OtpComponent } from './otp/otp';
import { CreateAccountComponent } from './create-account/create-account';
import { HomeComponent } from './home/home';
import { NewProjectComponent } from './first-new-project/first-new-project';
import { ProjectListComponent } from './project-list/project-list';
import { ProjectComponent } from './project/project';
import { UploadBillComponent } from './upload-bill/upload-bill';
import { BuildingListComponent } from './building-list/building-list';
import { BuildingInfoComponent } from './building-info/building-info';
import { BuildingBillsComponent } from './building-bills/building-bills';
import { BillInfoComponent } from './bill-info/bill-info';
import { ActionPlanComponent } from './action-plan/action-plan';
import { RenewableComponent } from './renewable/renewable';
import { AuditReportComponent } from './audit-report/audit-report';
import { GlossaryComponent } from './glossary/glossary';
import { ProfileComponent } from './profile/profile';
import { PersonalDataComponent } from './personal-data/personal-data';
import { SettingComponent} from './setting/setting';

import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';


import { BillExample } from './bill-example/bill-example';


export const routes: Routes = [
    { path: '', component: AccessComponent },   
    { path: 'login', component: LoginComponent },
    { path: 'otp', component: OtpComponent },
    { path: 'create-account', component: CreateAccountComponent},
    { path: 'home', component: HomeComponent },
    { path: 'create-new-project', component: NewProjectComponent }, 
    { path: 'project-list', component: ProjectListComponent },
    { path: 'project', component: ProjectComponent },
    { path: 'upload-bills', component: UploadBillComponent },
    { path: 'building-list', component: BuildingListComponent },
    { path: 'building-info/:id', component: BuildingInfoComponent },
    { path: 'building-bills/:id', component: BuildingBillsComponent },
    { path: 'bill-info/:id', component: BillInfoComponent },
    { path: 'action-plan', component: ActionPlanComponent },
    { path: 'renewable', component: RenewableComponent },
    { path: 'audit-report', component: AuditReportComponent },
    { path: 'glossary', component: GlossaryComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'personal-data', component: PersonalDataComponent },
    { path: 'settings', component: SettingComponent },

    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent },   
    
    
    { path: 'bill-example', component: BillExample },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


