import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-user-role-modal',
  templateUrl: './delete-user-role-modal.component.html',
  styleUrls: ['./delete-user-role-modal.component.css']
})
export class DeleteUserRoleModalComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteUserRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userRoleId: number, userName: string }
  ) { }

  confirm(): void {
    // Aquí puedes acceder a this.data.userRoleId y this.data.userName
    // para obtener la información necesaria antes de confirmar la eliminación

    // Emitir el evento de confirmación
    this.dialogRef.close('confirmed');
  }

  cancel(): void {
    // Emitir el evento de cancelación
    this.dialogRef.close('cancelled');
  }
}