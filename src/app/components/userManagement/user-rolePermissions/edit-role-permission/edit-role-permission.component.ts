import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from 'src/app/services/userServices/role-permission.service';
import { RolePermission } from 'src/app/interfaces/user/user-rolePermission';
import { MatDialog } from '@angular/material/dialog';
import { EditPermissionsModalComponent } from '../edit-permissions-modal/edit-permissions-modal.component';

@Component({
  selector: 'app-edit-role-permission',
  templateUrl: './edit-role-permission.component.html',
  styleUrls: ['./edit-role-permission.component.css']
})
export class EditRolePermissionComponent implements OnInit {
  myform: FormGroup = new FormGroup({});
  id?: number;
  roleWithPermissions: { RoleName: string, Permissions: string[], ApplicationPermissionIds: number[] } = { RoleName: '', Permissions: [], ApplicationPermissionIds: [] };
  expandTextarea: boolean = false;
  selectedPermissionsFromModal: { id: number, name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private rolePermissionService: RolePermissionService,
    private dialog: MatDialog
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(this.id) && this.id > 0) {
      this.initForm();
      this.getRoleDetails();
    } else {
      console.error('El ID del rol no es válido.');
    }
  }

  ngOnInit(): void {}

  openEditPermissionsModal(): void {
    const dialogRef = this.dialog.open(EditPermissionsModalComponent, {
      autoFocus: false,
      data: {
        permissions: this.roleWithPermissions.Permissions,
        permissionIds: this.roleWithPermissions.ApplicationPermissionIds
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Asigna los permisos seleccionados a la propiedad selectedPermissionsFromModal
      this.selectedPermissionsFromModal = result;
    });
  }

  initForm(): void {
    this.myform = this.fb.group({
      ApplicationRoleId: [null],
      ApplicationPermissionId: [null] // Puedes agregar validadores si es necesario
      // Otros controles según tus necesidades
    });
  }

  getRoleDetails(): void {
    this.rolePermissionService.getRolesAndPermissions().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          const roles: RolePermission[] = data.Data;
  
          // Filtramos solo los roles que coinciden con el ID en la URL
          const matchingRoles: RolePermission[] = roles.filter(role => role.ApplicationRoleId === this.id);
  
          if (matchingRoles.length > 0) {
            // Almacenamos la información del rol en la propiedad roleWithPermissions
            this.roleWithPermissions = {
              RoleName: matchingRoles[0].RoleName,
              Permissions: matchingRoles.map(role => role.PermissionName),
              ApplicationPermissionIds: matchingRoles.map(role => role.ApplicationPermissionId)
            };
          } else {
            console.error('No se encontró ningún rol con el ID especificado.');
          }
        } else {
          console.error('La propiedad "Data" no es una matriz en la respuesta del servicio.');
        }
      },
      (error) => {
        console.error('Error al obtener detalles del rol:', error);
      }
    );
  }

  guardarRol(): void {
    // Verificamos si hay permisos seleccionados desde el modal
    if (this.selectedPermissionsFromModal.length > 0) {
      // Mapeamos solo los IDs de los permisos seleccionados
      const permissionIds = this.selectedPermissionsFromModal.map(permission => permission.id);
  
      // Verificamos si `this.id` tiene un valor
      if (this.id !== undefined) {
        // Llamamos al servicio para actualizar el rol con los nuevos permisos
        this.rolePermissionService.editRolePermission(this.id, permissionIds).subscribe(
          (data: any) => {
            this.mensajeExito("updated");
            this.toListRolePermission();
          },
          (error) => {
            console.error('Error al actualizar el rol:', error);
            // Manejar el error según tus necesidades
          }
        );
      } else {
        console.warn('El ID del rol es indefinido.');
      }
    } else {
      console.warn('No hay permisos seleccionados para actualizar.');
    }
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The role permission was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  toListRolePermission() {
    this.router.navigate(['user-management/list-rolePermission']);
  }
  
}