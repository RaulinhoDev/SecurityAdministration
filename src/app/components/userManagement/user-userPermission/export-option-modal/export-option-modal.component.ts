import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-export-option-modal',
  templateUrl: './export-option-modal.component.html',
  styleUrls: ['./export-option-modal.component.css']
})
export class ExportOptionModalComponent {

  fileName: string;

  constructor(
    public dialogRef: MatDialogRef<ExportOptionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fileName = data.fileName;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  exportToExcel(): void {
    this.dialogRef.close('excel');
  }

  exportToPDF(): void {
    this.dialogRef.close('pdf');
  }
}