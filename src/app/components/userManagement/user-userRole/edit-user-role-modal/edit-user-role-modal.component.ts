import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserRoleService } from 'src/app/services/userServices/user-role.service';
import { Role } from 'src/app/interfaces/user/user-role';
import { UserRole } from 'src/app/interfaces/user/user-userRole';

@Component({
  selector: 'app-edit-user-role-modal',
  templateUrl: './edit-user-role-modal.component.html',
  styleUrls: ['./edit-user-role-modal.component.css']
})
export class EditUserRoleModalComponent implements OnInit {
  role: Role[] = [];
  userRole: UserRole;
  myform: FormGroup;

  constructor(
    private _userRoleService: UserRoleService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserRoleModalComponent>
  ) {
    this.userRole = data.userRole;

    this.myform = this.fb.group({
      Id: [this.userRole.Id, Validators.required], // Agrega el campo Id con su valor actual
      ApplicationUserId: [this.userRole.ApplicationUserId, Validators.required], // Agrega el campo ApplicationUserId con su valor actual
      ApplicationRoleId: [this.userRole.ApplicationRoleId, Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles() {
    this._userRoleService.getRoles().subscribe(
      (data: any) => {
        this.role = data.Data || [];
      },
      (error) => {
        console.error('Error al obtener la lista de roles:', error);
      }
    );
  }

  SaveChanges() {
    const updatedData = this.myform.value;
  
    this._userRoleService.updateUserRole(updatedData).subscribe(
      (response: any) => {
        // Recargar la página después de cerrar el modal
        this._snackBar.open('Role updated successfully', 'Close', {
        });
        setTimeout(() => {
          window.location.reload();
          
          // Mostrar el SnackBar después de recargar la página
          
        }, 1500); // Ajusta el tiempo según sea necesario
      },
      (error) => {
        console.error('Error updating user role:', error);
        this._snackBar.open('Error updating role. Please try again.', 'Close', {
          duration: 3000,
        });
      }
    );
    this.dialogRef.close('saved');
  }

  Cancel() {
    this.dialogRef.close();
  }
}
