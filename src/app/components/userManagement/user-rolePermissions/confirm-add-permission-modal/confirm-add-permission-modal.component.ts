import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-add-permission-modal',
  templateUrl: './confirm-add-permission-modal.component.html',
  styleUrls: ['./confirm-add-permission-modal.component.css']
})
export class ConfirmAddPermissionModalComponent implements OnInit {
  roleName: string;
  roleId: number;

  constructor(
    public dialogRef: MatDialogRef<ConfirmAddPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleName: string, roleId: number }
  ) {
    console.log(data)
    this.roleName = data.roleName;
    this.roleId = data.roleId;
  }

  ngOnInit(): void {
  }

  confirm(): void {
    // Llamas a la función para asignar permisos pasando el roleId
    this.assignPermissionsToRole(this.roleId);

    // Cierras la modal después de asignar permisos
    this.dialogRef.close({ confirmed: true, roleId: this.roleId });
  }

  cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }

  private assignPermissionsToRole(roleId: number): void {
    // Lógica para asignar permisos al rol con el roleId proporcionado
    // Implementa tu lógica aquí
  }
}
