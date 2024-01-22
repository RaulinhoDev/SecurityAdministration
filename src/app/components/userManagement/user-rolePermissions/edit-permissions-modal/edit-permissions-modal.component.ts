import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-edit-permissions-modal',
  templateUrl: './edit-permissions-modal.component.html',
  styleUrls: ['./edit-permissions-modal.component.css']
})
export class EditPermissionsModalComponent implements OnInit {
  allPermissions: ApplicationPermission[] = [];
  selectedPermissions: string[] = [];
  filteredPermissions: ApplicationPermission[] = [];
  selectedPermissionsInView: ApplicationPermission[] = [];
  pageSize = 10;
  pageIndex = 0;
  searchQuery = '';

  constructor(
    public dialogRef: MatDialogRef<EditPermissionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit(): void {
    this.loadAllPermissions();
    this.selectedPermissions = this.data.permissions || [];
    this.markSelectedPermissions();
  }

  loadAllPermissions(): void {
    this.permissionsService.getPermissions().subscribe(
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
    this.selectedPermissionsInView = [];

    this.selectedPermissionsInView = this.selectedPermissions.map(permissionName => {
      return {
        Id: 0, 
        Permission: permissionName,
        selected: true 
      } as ApplicationPermission;
    });

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
    // nombres de permisos seleccionados desde selectedPermissionsInView
    const selectedPermissions = this.selectedPermissionsInView.map(p => ({
      id: this.getPermissionIdByName(p.Permission) || 0, // Usa 0 o un valor predeterminado si es undefined
      name: p.Permission,
    }));
  
    // Cierra el modal y pasa los permisos seleccionados
    this.dialogRef.close(selectedPermissions);
  }
}