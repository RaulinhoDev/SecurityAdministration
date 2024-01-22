import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';
import { UserPermissionService } from 'src/app/services/userServices/user-userPermission.service';

@Component({
  selector: 'app-edit-user-permission-modal',
  templateUrl: './edit-user-permission-modal.component.html',
  styleUrls: ['./edit-user-permission-modal.component.css']
})
export class EditUserPermissionModalComponent implements OnInit {
  allPermissions: ApplicationPermission[] = [];
  selectedPermissions: string[] = [];
  filteredPermissions: ApplicationPermission[] = [];
  selectedPermissionsInView: ApplicationPermission[] = [];
  pageSize = 10;
  pageIndex = 0;
  searchQuery = '';

  constructor(
    public dialogRef: MatDialogRef<EditUserPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private _permissionsService: PermissionsService,
    private _userPermissionsService: UserPermissionService
  ) { }

  ngOnInit(): void {
    this.loadAllPermissions();
    this.selectedPermissions = this.data.permissions || [];
    if (this.data && this.data.permissions) {
      this.selectedPermissions = this.data.permissions;
      this.markSelectedPermissions();
    }
  }

  loadAllPermissions(): void {
    this._permissionsService.getPermissions().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.allPermissions = data.Data;
          this.filteredPermissions = this.allPermissions;
        } else if (data.Data) {
          this.allPermissions = [data.Data];
          this.filteredPermissions = this.allPermissions;
        } else {
          console.error('La propiedad "Data" no es un arreglo o un objeto en la respuesta del servicio.');
        }
        // Después de cargar los permisos, marca los seleccionados
        this.markSelectedPermissions();
      },
      (error) => {
        console.error('Error fetching permissions:', error);
      }
    );
  }

  togglePermissionSelection(permission: ApplicationPermission): void {
    const isSelected = this.isSelected(permission.Permission);
  
    if (isSelected) {
      this.removePermission(permission);
    } else {
      this.addPermission(permission);
    }
  }
  
  removePermission(permission: ApplicationPermission): void {
    const existingIndex = this.selectedPermissionsInView.findIndex(
      p => p.Permission === permission.Permission
    );
  
    if (existingIndex !== -1) {
      this.selectedPermissionsInView.splice(existingIndex, 1);
    } else {
      // Si no existe, agrega el permiso
      this.addPermission(permission);
    }
  }
  
  addPermission(permission: ApplicationPermission): void {
    const alreadyAdded = this.selectedPermissionsInView.some(
      p => p.Permission === permission.Permission
    );
  
    if (!alreadyAdded) {
      this.selectedPermissionsInView.push(permission);
    } else {
      // Si ya está agregado, elimina el permiso
      this.removePermission(permission);
    }
  }
  
  markSelectedPermissions(): void {
    // Reinicia la lista de permisos seleccionados en la vista
    this.selectedPermissionsInView = [];
  
    // Agrega directamente los permisos seleccionados al modelo de vista
    this.selectedPermissionsInView = this.selectedPermissions.map(permissionName => {
      return {
        Id: 0,
        Permission: permissionName
      } as ApplicationPermission;
    });
  
    // Marca los permisos seleccionados en filteredPermissions
    this.filteredPermissions.forEach(permission => {
      permission.selected = this.selectedPermissionsInView.some(
        selectedPermission => selectedPermission.Permission === permission.Permission
      );
    });
  }

  get startIndex(): number {
    return this.pageIndex * this.pageSize;
  }

  get endIndex(): number {
    return (this.pageIndex + 1) * this.pageSize;
  }

  isSelected(permissionName: string): boolean {
    return this.selectedPermissions.includes(permissionName);
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.filteredPermissions = this.allPermissions.filter(permission =>
      permission.Permission.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  savePermissions(): void {
    this.dialogRef.close(this.selectedPermissions);
  }

  getPermissionIdByName(permissionName: string): number | undefined {
    const permission = this.allPermissions.find(p => p.Permission === permissionName);
    return permission ? permission.Id : undefined; // Devuelve el ID o undefined si no se encuentra
  }
  
  acceptChanges(): void {
    const selectedPermissionIds = this.selectedPermissionsInView.map(p =>
      this.getPermissionIdByName(p.Permission) || 0
    );
  
    const userId = this.data.userId || 0; // Ajusta según tus necesidades
  
    this._userPermissionsService.editUserPermission(userId, selectedPermissionIds).subscribe(
      (response: any) => {
        // Realiza acciones después de guardar si es necesario
        this.dialogRef.close('confirmed');
  
        // Muestra el MatSnackBar después de cerrar el modal
        this.showNotification('permissions successfully edited');
  
        // Cierra el modal con un resultado 'confirmed' después de 2 segundos
        setTimeout(() => {
          this.dialogRef.close('confirmed');
        }, 1000);
  
        // Espera 2.5 segundos antes de recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      },
      (error) => {
        console.error('Error al guardar los permisos:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }

  // Muestra una notificación utilizando MatSnackBar
  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duración en milisegundos
    });
  }
  

}
