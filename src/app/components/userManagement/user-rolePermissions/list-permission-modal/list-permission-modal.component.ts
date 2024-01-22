import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list-permission-modal',
  templateUrl: './list-permission-modal.component.html',
  styleUrls: ['./list-permission-modal.component.css']
})
export class ListPermissionModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ListPermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleName: string, permissions: string[] }
  ) {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}