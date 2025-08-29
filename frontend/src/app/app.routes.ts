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
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
    { path: '', component: AccessComponent },   
    { path: 'login', component: LoginComponent },
    { path: 'otp', component: OtpComponent },
    { path: 'create-account', component: CreateAccountComponent},
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password/:token', component: ResetPasswordComponent }, 
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'create-new-project', component: NewProjectComponent, canActivate: [AuthGuard] }, 
    { path: 'project-list', component: ProjectListComponent, canActivate: [AuthGuard] },
    { path: 'project/:id', component: ProjectComponent, canActivate: [AuthGuard] },
    { path: 'upload-bills', component: UploadBillComponent, canActivate: [AuthGuard] },
    { path: 'building-list/:id', component: BuildingListComponent, canActivate: [AuthGuard] },
    { path: 'building-info/:id', component: BuildingInfoComponent, canActivate: [AuthGuard] },
    { path: 'building-bills/:id', component: BuildingBillsComponent , canActivate: [AuthGuard]},
    { path: 'bill-info/:id', component: BillInfoComponent, canActivate: [AuthGuard] },
    { path: 'action-plan', component: ActionPlanComponent, canActivate: [AuthGuard] },
    { path: 'renewable', component: RenewableComponent , canActivate: [AuthGuard]},
    { path: 'audit-report', component: AuditReportComponent, canActivate: [AuthGuard] },
    { path: 'glossary', component: GlossaryComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'personal-data', component: PersonalDataComponent , canActivate: [AuthGuard]},
    { path: 'settings', component: SettingComponent , canActivate: [AuthGuard]},
    { path: 'bill-example', component: BillExample },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }


