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
import { AddBuildingComponent } from './add-building/add-building';
import { UploadBillComponent } from './upload-bill/upload-bill';
import { FirstBillComponent } from './first-bill/first-bill';
import { UploadBillIdComponent } from './upload-bill-id/upload-bill-id';
import { BuildingListComponent } from './building-list/building-list';
import { BuildingInfoComponent } from './building-info/building-info';
import { BuildingBillsComponent } from './building-bills/building-bills';
import { MonthBillComponent } from './month-bill/month-bill';
import { BillInfoComponent } from './bill-info/bill-info';
import { BillListComponent } from './bill-list/bill-list';
import { ActionPlanComponent } from './action-plan/action-plan';

import { RenewableComponent } from './renewable/renewable';
import { AuditReportComponent } from './audit-report/audit-report';
import { GlossaryComponent } from './glossary/glossary';
import { ProfileComponent } from './profile/profile';
import { PersonalDataComponent } from './personal-data/personal-data';
import { SettingComponent } from './setting/setting';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { ResetPasswordComponent } from './reset-password/reset-password';
import { BillExampleComponent } from './bill-example/bill-example';
import { AuthGuard } from './auth.guard';

import { SupplierLoginComponent } from './supplier-login/supplier-login';
import { SupplierOtpComponent } from './supplier-otp/supplier-otp';
import { ActionPlanSupplierComponent } from './action-plan-supplier/action-plan-supplier';
import { SupplierRecommendedComponent } from './supplier-recommended/supplier-recommended';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile';
import { SupplierPersonalDataComponent } from './supplier-personal-data/supplier-personal-data';
import { SupplierSettingComponent } from './supplier-setting/supplier-setting';


export const routes: Routes = [
  //Before login
  { path: '', component: AccessComponent },
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  //After user login
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-new-project', component: NewProjectComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'project-list', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'add-building/:id', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'first-bill', component: FirstBillComponent, canActivate: [AuthGuard] },
  { path: 'upload-bills', component: UploadBillComponent, canActivate: [AuthGuard] },
  { path: 'upload-bills-id/:id', component: UploadBillIdComponent, canActivate: [AuthGuard] },
  { path: 'building-list/:id', component: BuildingListComponent, canActivate: [AuthGuard] },
  { path: 'building-info/:id', component: BuildingInfoComponent, canActivate: [AuthGuard] }, 
  { path: 'building-bills/:id', component: BuildingBillsComponent, canActivate: [AuthGuard] },
  { path: 'bill-info/:id', component: BillInfoComponent, canActivate: [AuthGuard] },
  { path: 'bills', component: BillListComponent, canActivate: [AuthGuard] },
  { path: 'month-bill/:id/:type', component: MonthBillComponent, canActivate: [AuthGuard] },
  { path: 'action-plan', component: ActionPlanComponent, canActivate: [AuthGuard] },
  { path: 'renewable', component: RenewableComponent, canActivate: [AuthGuard] },
  { path: 'audit-report', component: AuditReportComponent, canActivate: [AuthGuard] },
  { path: 'glossary', component: GlossaryComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'personal-data', component: PersonalDataComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingComponent, canActivate: [AuthGuard] },
  { path: 'bill-example', component: BillExampleComponent },

//Supplier routes
  { path: 'supplier-login', component: SupplierLoginComponent },
  { path: 'supplier-otp', component: SupplierOtpComponent },
  { path: 'action-plan-supplier', component: ActionPlanSupplierComponent, canActivate: [AuthGuard] },
  { path: 'recommended/:term', component: SupplierRecommendedComponent, canActivate: [AuthGuard] },
  { path: 'supplier-profile', component: SupplierProfileComponent, canActivate: [AuthGuard] },
  { path: 'supplier-personal-data', component: SupplierPersonalDataComponent, canActivate: [AuthGuard] },
  { path: 'supplier-settings', component: SupplierSettingComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
