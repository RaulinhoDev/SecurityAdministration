import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';
import { UserPermissionService } from 'src/app/services/userServices/user-userPermission.service';

@Component({
  selector: 'app-add-user-permission-modal',
  templateUrl: './add-user-permission-modal.component.html',
  styleUrls: ['./add-user-permission-modal.component.css']
})
export class AddUserPermissionModalComponent implements OnInit {
  permissions: ApplicationPermission[] = [];
  selectedPermissions: ApplicationPermission[] = [];
  pageSize = 10;
  pageIndex = 0;
  searchQuery = '';

  get filteredPermissions(): ApplicationPermission[] {
    return this.permissions
      .filter(permission => permission.Permission.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }


  get startIndex(): number {
    return this.pageIndex * this.pageSize;
  }

  get endIndex(): number {
    return (this.pageIndex + 1) * this.pageSize;
  }

  constructor(
    public dialogRef: MatDialogRef<AddUserPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number, userName: string },
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private _permissionsService: PermissionsService,
    private _userPermissionsService: UserPermissionService
  ) { }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this._permissionsService.getPermissions().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.permissions = data.Data;
        } else if (data.Data) {
          // Si data.Data no es un array pero existe, intenta convertirlo a un array.
          this.permissions = [data.Data];
        } else {
          console.error('La propiedad "Data" no es un arreglo o un objeto en la respuesta del servicio.');
        }
      },
      (error) => {
        console.error('Error fetching permissions:', error);
      }
    );
  }

  togglePermissionSelection(permission: ApplicationPermission): void {
    const index = this.selectedPermissions.findIndex(p => p.Id === permission.Id);
    if (index !== -1) {
      this.selectedPermissions.splice(index, 1);
    } else {
      this.selectedPermissions.push(permission);
    }
  }

  isSelected(permission: ApplicationPermission): boolean {
    return this.selectedPermissions.some(p => p.Id === permission.Id);
  }

  saveUserPermissions(): void {
    const userId = this.data.userId;
  
    if (userId !== undefined) {
      const permissionIds = this.selectedPermissions.map(p => p.Id);
  
      if (permissionIds.every(id => id !== undefined)) {
        this._userPermissionsService.addUserPermission(userId, permissionIds as number[]).subscribe(
          (response) => {
            console.log('Permisos guardados exitosamente', response);
            // Muestra una notificación
            this.showNotification('Permissions assigned successfully.');
  
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
            console.error('Error al guardar permisos', error);
            // Puedes manejar el error según tus necesidades
          }
        );
      } else {
        console.error('permissionIds contiene elementos undefined. No se puede guardar los permisos.');
        this.showNotification('Error: Some permissions could not be assigned.');
      }
    } else {
      console.error('userId es undefined. No se puede guardar los permisos.');
      this.showNotification('Error: User ID is undefined.');
    }
  }

  savePermissions(): void {
    this.dialogRef.close('confirmed');
  }

  
  // Muestra una notificación utilizando MatSnackBar
  private showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duración en milisegundos
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
  }

  onSearchChange(): void {
    this.pageIndex = 0; // Resetea la página al cambiar la búsqueda
  }
}