import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-permissions-modal',
  templateUrl: './permissions-modal.component.html',
  styleUrls: ['./permissions-modal.component.css']
})
export class PermissionsModalComponent implements OnInit {
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
    public dialogRef: MatDialogRef<PermissionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionsService.getPermissions().subscribe(
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

  closeModal(): void {
    this.dialogRef.close();
  }

  savePermissions(): void {
    this.dialogRef.close(this.selectedPermissions);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
  }

  onSearchChange(): void {
    this.pageIndex = 0; // Resetea la página al cambiar la búsqueda
  }
}