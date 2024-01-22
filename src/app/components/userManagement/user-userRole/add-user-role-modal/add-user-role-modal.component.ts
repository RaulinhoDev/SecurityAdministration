import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Role } from 'src/app/interfaces/user/user-role';
import { User } from 'src/app/interfaces/user/user'; 
import { UserRoleService } from 'src/app/services/userServices/user-role.service';
import { UserService } from 'src/app/services/userServices/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-user-role-modal',
  templateUrl: './add-user-role-modal.component.html',
  styleUrls: ['./add-user-role-modal.component.css']
})
export class AddUserRoleModalComponent implements OnInit {
  id!: number;
  myform: FormGroup;
  role: Role[] = [];
  users: User[] = [];
  user!: User;
  userName: string = '';
  userCtrl = new FormControl();
  filteredUsers!: Observable<User[]>; // Cambia el tipo de Observable a User
  dialogRef: MatDialogRef<AddUserRoleModalComponent>;

  @Output() userRoleSaved: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private _userRoleService: UserRoleService,
    private _userService: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private aRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    dialogRef: MatDialogRef<AddUserRoleModalComponent>
  ) {
    this.id = Number(data.roleId);
    this.dialogRef = dialogRef;
    this.myform = this.fb.group({
      ApplicationUserId: [this.id],
      Name: [this.userName],
      ApplicationRoleId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.obtenerRoles();
    this.obtainUser();
    this.userAutoComplete(); // Llama a la función para cargar usuarios automáticamente
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

  userAutoComplete() {
    this._userRoleService.getUsersForAutocomplete().subscribe(
      (users: User[]) => {
        this.users = users;
        this.filteredUsers = this.userCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  obtainUser() {
    this._userService.getUser(this.id).subscribe(
      (data: any) => {
        if (data.Data && data.Data.Id) {
          this.user = data.Data;
          this.myform.patchValue({
            Name: this.user.Name
          });
        } else {
          console.error('Respuesta del servidor sin datos válidos:', data);
          // Puedes mostrar un mensaje al usuario o tomar alguna acción adicional
        }
      },
      (error) => {
        console.error('Error al obtener UserRole:', error);
        // Puedes mostrar un mensaje al usuario o tomar alguna acción adicional
      }
    );
  }
  

  private _filter(value: string | User): User[] {
    const filterValue = typeof value === 'string' ? value : '';
  
    return Array.isArray(this.users)
      ? this.users.filter(user => user.Name && user.Name.includes(filterValue))
      : [];
  }

  seleccionarUsuario(user: User) {
    this.myform.patchValue({ ApplicationUserId: user.Id });
    this.userCtrl.setValue(user.Name);
  }

  SaveUserRole() {
    if (this.myform.valid) {
      const formData = this.myform.value;
      this._userRoleService.addUserRole(formData).subscribe(
        (response) => {
          this._snackBar.open('UserRole saved successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(response);

          // Emitir el evento para indicar que el UserRole ha sido guardado
          this.userRoleSaved.emit();
        },
        (error) => {
          console.error('Error saving UserRole:', error);
          this._snackBar.open('Error saving UserRole. Please try again.', 'Close', { duration: 3000 });
        }
      );
    }
  }

  toUserRole() {
    // Cierra el modal al navegar a la lista de roles de usuario
    this.dialogRef.close();
  }

}
