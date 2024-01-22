import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from 'src/app/services/userServices/role-permission.service';
import { RoleService } from 'src/app/services/userServices/role.service';
import { MatDialog } from '@angular/material/dialog';
import { PermissionsModalComponent } from '../permissions-modal/permissions-modal.component';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { Role } from 'src/app/interfaces/user/user-role';

@Component({
  selector: 'app-add-role-permission',
  templateUrl: './add-role-permission.component.html',
  styleUrls: ['./add-role-permission.component.css']
})
export class AddRolePermissionComponent implements OnInit {
  id!: number;
  myform: FormGroup;
  role!: Role;
  roleName: string = '';
  selectedPermissions: ApplicationPermission[] = [];

  constructor(
    private rolePermissionServices: RolePermissionService,
    private _roleService: RoleService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private aRoute: ActivatedRoute,
  ) 
  
  {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({
      ApplicationRoleId: [this.id],
      RoleName: [this.roleName]
    });
  }

  ngOnInit(): void {
    this. obtainRole();
    this.selectedPermissions;
  }


  obtainRole() {
    this.rolePermissionServices.getRole(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.role = data.Data;
  
          if (this.role) {
            this.myform.patchValue({
              RoleName: this.role.RoleName
            });
          } else {
            console.error('Role is null.');
          }
        } else {
          console.error('Role not found.');
        }
      },
      (error) => {
        console.error('Error to get Role:', error);
      }
    );
  }


  openPermissionsModal(): void {
    const dialogRef = this.dialog.open(PermissionsModalComponent, {
      width: '400px',
      maxWidth: '300px',
      minWidth: '300px',
      autoFocus: false,
      data: {} // Puedes pasar datos adicionales al modal si es necesario
    });

    dialogRef.afterClosed().subscribe(
      (selectedPermissions: ApplicationPermission[]) => {
        if (selectedPermissions && selectedPermissions.length > 0) {
          this.selectedPermissions = selectedPermissions;
        }
      },
      (error) => {
        console.error('Error al abrir la modal', error);
      }
    );
  }

  saveRoleWithPermissions(): void {
    const roleIdControl = this.myform.get('ApplicationRoleId');
  
    if (roleIdControl && roleIdControl.value !== null) {
      const roleId = roleIdControl.value;
      const permissionIds = this.selectedPermissions
        .filter(permission => permission.Id !== undefined)
        .map(permission => permission.Id as number);
  
      try {
        this.rolePermissionServices.addRolePermission(roleId, permissionIds)
          .subscribe(
            (response) => {
              this.showSuccessMessage('Permissions have been successfully assigned to the role.');
              this.tolistRolePermission();
              
            },
            (error) => {
              console.error('Error adding the role with permissions:', error);
              this.showErrorMessage('Error adding the role with permissions:' + error);
            }
          );
      } catch (error) {
        console.error('Unexpected error while processing the request:', error);
        this.showErrorMessage('Unexpected error while processing the request: ' + error);
      }
    } else {
      console.error('Error: ApplicationRoleId is null or not defined.');
      this.showErrorMessage('Error: ApplicationRoleId is null or not defined.');
    }
  }

  showSuccessMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  showErrorMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  tolistRolePermission() {
    this.router.navigate(["user-management/list-rolePermission"]);
  }
}