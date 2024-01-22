import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListApplicationsComponent } from './components/applicationsManagement/applications/list-applications/list-applications.component';
import { HomeComponent } from './components/home/home.component';
import { MenuAppComponent } from './components/applicationsManagement/menu-app/menu-app.component';
import { ListModulesComponent } from './components/applicationsManagement/applicationsModules/list-modules/list-modules.component';
import { ListSectionsComponent } from './components/applicationsManagement/applicationsSections/list-sections/list-sections.component';
import { ListPermissionsComponent } from './components/applicationsManagement/applicationsPermissions/list-permissions/list-permissions.component';
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
import { MenuUserComponent } from './components/userManagement/menu-user/menu-user.component';
import { AddUserRoleComponent } from './components/userManagement/user-userRole/add-user-role/add-user-role.component';
import { AddRolePermissionComponent } from './components/userManagement/user-rolePermissions/add-role-permission/add-role-permission.component';
import { ListRolePermissionComponent } from './components/userManagement/user-rolePermissions/list-role-permission/list-role-permission.component';
import { EditRolePermissionComponent } from './components/userManagement/user-rolePermissions/edit-role-permission/edit-role-permission.component';
import { ListUserComponent } from './components/userManagement/user/list-user/list-user.component';
import { AddUserComponent } from './components/userManagement/user/add-user/add-user.component';
import { ListUserRoleComponent } from './components/userManagement/user-userRole/list-user-role/list-user-role.component';
import { UserManagementComponent } from './components/userManagement/user-management/user-management.component';
import { ApplicationManagementComponent } from './components/applicationsManagement/application-management/application-management.component';
import { EditUserRoleModalComponent } from './components/userManagement/user-userRole/edit-user-role-modal/edit-user-role-modal.component';
import { EditUserComponent } from './components/userManagement/user/edit-user/edit-user.component';
import { DetailUserComponent } from './components/userManagement/user/detail-user/detail-user.component';
import { DetailPermissionsComponent } from './components/applicationsManagement/applicationsPermissions/detail-permissions/detail-permissions.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'menuApp', component: MenuAppComponent },
  { path: 'userApp', component: MenuUserComponent },
  { path: 'application-management', component: ApplicationManagementComponent },
  { path: 'user-management', component: UserManagementComponent },
  //Applications
  { path: 'list-applications', component: ListApplicationsComponent },
  { path: 'add-applications', component: AddApplicationsComponent },
  { path: 'edit-applications/:id', component: EditApplicationsComponent },
  { path: 'detail-applications/:id', component: DetailApplicationsComponent },

  //Modules
  { path: 'list-modules', component: ListModulesComponent },
  { path: 'add-modules', component: AddModulesComponent },
  { path: 'edit-modules/:id', component: EditModulesComponent },
  { path: 'detail-modules/:id', component: DetailModulesComponent },

  //Sections
  { path: 'list-sections', component: ListSectionsComponent },
  { path: 'add-sections', component: AddSectionComponent },
  { path: 'edit-sections/:id', component: EditSectionComponent },
  { path: 'detail-sections/:id', component: DetailSectionComponent },

  //Permissions
  { path: 'list-permissions', component: ListPermissionsComponent },
  { path: 'add-permissions', component: AddPermissionComponent },
  { path: 'edit-permissions/:id', component: EditPermissionComponent },
  { path: 'detail-permissions/:id', component: DetailPermissionsComponent },

  //User
  { path: 'list-user', component: ListUserComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: 'detail-user/:id', component: DetailUserComponent },
  
  //Role
  { path: 'add-role', component: AddRoleComponent },

  //RolePermission
  { path: 'add-rolePermission/:id', component: AddRolePermissionComponent },
  { path: 'list-rolePermission', component: ListRolePermissionComponent },
  { path: 'edit-rolePermission/:id', component: EditRolePermissionComponent },

  //UserRole
  { path: 'add-userRole', component: AddUserRoleComponent },
  { path: 'add-userRole/:id', component: AddUserRoleComponent },
  { path: 'list-userRole', component: ListUserRoleComponent },
  { path: 'edit-userRole/:id', component: EditUserRoleModalComponent },

  {
    path: 'user-management',
    component: UserManagementComponent,
    children: [
      { path: 'list-rolePermission', component: ListRolePermissionComponent },
      { path: 'add-rolePermission/:id', component: AddRolePermissionComponent },
      { path: 'edit-rolePermission/:id', component: EditRolePermissionComponent },
      { path: 'list-userRole', component: ListUserRoleComponent },
      { path: '', redirectTo: 'list-userRole', pathMatch: 'full' } // Ruta por defecto
    ]
  },

  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
