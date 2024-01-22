import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-role-modal',
  templateUrl: './delete-role-modal.component.html',
  styleUrls: ['./delete-role-modal.component.css']
})
export class DeleteRoleModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteRoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roleName: string }
  ) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close('cancel');
  }

  onConfirmClick(): void {
    this.dialogRef.close('confirm');
  }
}
