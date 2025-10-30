import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Access } from './access/access';
import { Login } from './login/login';
import { Welcome } from './welcome/welcome';
import { Otp } from './otp/otp';
import { CreateAccount } from './create-account/create-account';
import { Home } from './home/home';
import { NewProject } from './first-new-project/first-new-project';
import { UploadFirstBill } from './upload-first-bill/upload-first-bill';
import { ProjectList } from './project-list/project-list';
import { ProjectsList } from './projects-list/projects-list';
import { AddBuilding } from './add-building/add-building';
import { UploadBillId } from './upload-bill-id/upload-bill-id';
import { BuildingList } from './building-list/building-list';
import { BuildingInfo } from './building-info/building-info';
import { EditBuildingInfo } from './edit-building-info/edit-building-info';
import { BillList } from './bill-list/bill-list';
import { ActionPlan } from './action-plan/action-plan';
import { Recommended } from './recommended/recommended';
import { Actions } from './actions/actions';
import { BillInformation } from './bill-information/bill-information';
import { Renewable } from './renewable/renewable';
import { AuditReport } from './audit-report/audit-report';
import { Glossary } from './glossary/glossary';
import { Profile } from './profile/profile';
import { PersonalData } from './personal-data/personal-data';
import { Setting } from './setting/setting';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { AuthGuard } from './auth.guard';

import { SupplierLogin } from './supplier-login/supplier-login';
import { SupplierOtp } from './supplier-otp/supplier-otp';
import { ActionPlanSupplier } from './action-plan-supplier/action-plan-supplier';
import { SupplierRecommended } from './supplier-recommended/supplier-recommended';
import { SupplierUpload } from './supplier-upload/supplier-upload';
import { SupplierProfile } from './supplier-profile/supplier-profile';
import { SupplierPersonalData } from './supplier-personal-data/supplier-personal-data';
import { SupplierSetting } from './supplier-setting/supplier-setting';

export const routes: Routes = [
  // Before login
  { path: '', component: Access },
  { path: 'login', component: Login },
  { path: 'otp', component: Otp },
  { path: 'create-account', component: CreateAccount },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:token', component: ResetPassword },
  { path: 'welcome', component: Welcome },

  // After user login
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'create-new-project', component: NewProject, canActivate: [AuthGuard] },
  { path: 'upload-first-bill/:id', component: UploadFirstBill, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectsList, canActivate: [AuthGuard] },
  { path: 'project-list', component: ProjectList, canActivate: [AuthGuard] },
  { path: 'add-building/:id', component: AddBuilding, canActivate: [AuthGuard] },
  { path: 'upload-bills-id/:id', component: UploadBillId, canActivate: [AuthGuard] },
  { path: 'building-list/:id', component: BuildingList, canActivate: [AuthGuard] },
  { path: 'building-info/:id', component: BuildingInfo, canActivate: [AuthGuard] },
  { path: 'edit-building-info/:id', component: EditBuildingInfo, canActivate: [AuthGuard] },
  { path: 'bills/:id/:type', component: BillList, canActivate: [AuthGuard] },
  { path: 'bill-information/:type', component: BillInformation, canActivate: [AuthGuard] },
  { path: 'action-plan', component: ActionPlan, canActivate: [AuthGuard] },
  { path: 'recommended/:term', component: Recommended, canActivate: [AuthGuard] },
  { path: 'actions/:term', component: Actions, canActivate: [AuthGuard] },
  { path: 'renewable', component: Renewable, canActivate: [AuthGuard] },
  { path: 'audit-report', component: AuditReport, canActivate: [AuthGuard] },
  { path: 'glossary', component: Glossary, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'personal-data', component: PersonalData, canActivate: [AuthGuard] },
  { path: 'settings', component: Setting, canActivate: [AuthGuard] },

  // Supplier routes
  { path: 'supplier-login', component: SupplierLogin },
  { path: 'supplier-otp', component: SupplierOtp },
  { path: 'action-plan-supplier', component: ActionPlanSupplier, canActivate: [AuthGuard] },
  { path: 'supplier-recommended/:term', component: SupplierRecommended, canActivate: [AuthGuard] },
  { path: 'upload/:term', component: SupplierUpload, canActivate: [AuthGuard] },
  { path: 'supplier-profile', component: SupplierProfile, canActivate: [AuthGuard] },
  { path: 'supplier-personal-data', component: SupplierPersonalData, canActivate: [AuthGuard] },
  { path: 'supplier-settings', component: SupplierSetting, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
