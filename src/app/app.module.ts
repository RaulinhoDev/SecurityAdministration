import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { ListApplicationsComponent } from './components/applicationsManagement/applications/list-applications/list-applications.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AngularMaterialModule } from './components/shared/angular-material.module';
import { MenuAppComponent } from './components/applicationsManagement/menu-app/menu-app.component';
import { ListModulesComponent } from './components/applicationsManagement/applicationsModules/list-modules/list-modules.component';
import { DeleteModulesComponent } from './components/applicationsManagement/applicationsModules/delete-modules/delete-modules.component';
import { ListSectionsComponent } from './components/applicationsManagement/applicationsSections/list-sections/list-sections.component';
import { ListPermissionsComponent } from './components/applicationsManagement/applicationsPermissions/list-permissions/list-permissions.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { DetailApplicationsComponent } from './components/applicationsManagement/applications/detail-applications/detail-applications.component';
import { AddApplicationsComponent } from './components/applicationsManagement/applications/add-applications/add-applications.component';
import { EditApplicationsComponent } from './components/applicationsManagement/applications/edit-applications/edit-applications.component';
import { AddModulesComponent } from './components/applicationsManagement/applicationsModules/add-modules/add-modules.component';
import { EditModulesComponent } from './components/applicationsManagement/applicationsModules/edit-modules/edit-modules.component';
import { DetailModulesComponent } from './components/applicationsManagement/applicationsModules/detail-modules/detail-modules.component';
import { DetailSectionComponent } from './components/applicationsManagement/applicationsSections/detail-section/detail-section.component';
import { AddSectionComponent } from './components/applicationsManagement/applicationsSections/add-section/add-section.component';
import { EditSectionComponent } from './components/applicationsManagement/applicationsSections/edit-section/edit-section.component';
import { AddPermissionComponent } from './components/applicationsManagement/applicationsPermissions/add-permission/add-permission.component';
import { EditPermissionComponent } from './components/applicationsManagement/applicationsPermissions/edit-permission/edit-permission.component';
import { AddRoleComponent } from './components/userManagement/user-roles/add-role/add-role.component';
import { EditRoleComponent } from './components/userManagement/user-roles/edit-role/edit-role.component';
import { MenuUserComponent } from './components/userManagement/menu-user/menu-user.component';
import { AddUserRoleComponent } from './components/userManagement/user-userRole/add-user-role/add-user-role.component';
import { AddRolePermissionComponent } from './components/userManagement/user-rolePermissions/add-role-permission/add-role-permission.component';
import { PermissionsModalComponent } from './components/userManagement/user-rolePermissions/permissions-modal/permissions-modal.component';
import { EditRolePermissionComponent } from './components/userManagement/user-rolePermissions/edit-role-permission/edit-role-permission.component';
import { ListRolePermissionComponent } from './components/userManagement/user-rolePermissions/list-role-permission/list-role-permission.component';
import { ListPermissionModalComponent } from './components/userManagement/user-rolePermissions/list-permission-modal/list-permission-modal.component';
import { SidenavbarComponent } from './components/sidenavbar/sidenavbar.component';
import { EditPermissionsModalComponent } from './components/userManagement/user-rolePermissions/edit-permissions-modal/edit-permissions-modal.component';
import { AddUserComponent } from './components/userManagement/user/add-user/add-user.component';
import { ListUserComponent } from './components/userManagement/user/list-user/list-user.component';
import { ListUserRoleComponent } from './components/userManagement/user-userRole/list-user-role/list-user-role.component';
import { UserManagementComponent } from './components/userManagement/user-management/user-management.component';
import { ApplicationManagementComponent } from './components/applicationsManagement/application-management/application-management.component';
import { AddUserRoleModalComponent } from './components/userManagement/user-userRole/add-user-role-modal/add-user-role-modal.component';
import { EditUserRoleModalComponent } from './components/userManagement/user-userRole/edit-user-role-modal/edit-user-role-modal.component';
import { ConfirmAddPermissionModalComponent } from './components/userManagement/user-rolePermissions/confirm-add-permission-modal/confirm-add-permission-modal.component';
import { EditUserComponent } from './components/userManagement/user/edit-user/edit-user.component';
import { DetailUserComponent } from './components/userManagement/user/detail-user/detail-user.component';
import { DetailPermissionsComponent } from './components/applicationsManagement/applicationsPermissions/detail-permissions/detail-permissions.component';
import { DeleteUserRoleModalComponent } from './components/userManagement/user-userRole/delete-user-role-modal/delete-user-role-modal.component';
import { DeleteRoleModalComponent } from './components/userManagement/user-roles/delete-role-modal/delete-role-modal.component';
import { AddUserPermissionModalComponent } from './components/userManagement/user-userPermission/add-user-permission-modal/add-user-permission-modal.component';
import { EditUserPermissionModalComponent } from './components/userManagement/user-userPermission/edit-user-permission-modal/edit-user-permission-modal.component';
import { ExportOptionModalComponent } from './components/userManagement/user-userPermission/export-option-modal/export-option-modal.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListApplicationsComponent,
    NavbarComponent,
    MenuAppComponent,
    ListModulesComponent,
    DeleteModulesComponent,
    ListSectionsComponent,
    ListPermissionsComponent,
    SpinnerComponent,
    DetailApplicationsComponent,
    AddApplicationsComponent,
    EditApplicationsComponent,
    AddModulesComponent,
    EditModulesComponent,
    DetailModulesComponent,
    DetailSectionComponent,
    AddSectionComponent,
    EditSectionComponent,
    AddPermissionComponent,
    EditPermissionComponent,
    AddRoleComponent,
    EditRoleComponent,
    MenuUserComponent,
    AddUserRoleComponent,
    AddRolePermissionComponent,
    PermissionsModalComponent,
    EditRolePermissionComponent,
    ListRolePermissionComponent,
    ListPermissionModalComponent,
    SidenavbarComponent,
    EditPermissionsModalComponent,
    AddUserComponent,
    ListUserComponent,
    ListUserRoleComponent,
    UserManagementComponent,
    ApplicationManagementComponent,
    AddUserRoleModalComponent,
    EditUserRoleModalComponent,
    ConfirmAddPermissionModalComponent,
    EditUserComponent,
    DetailUserComponent,
    DetailPermissionsComponent,
    DeleteUserRoleModalComponent,
    DeleteRoleModalComponent,
    AddUserPermissionModalComponent,
    EditUserPermissionModalComponent,
    ExportOptionModalComponent
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
