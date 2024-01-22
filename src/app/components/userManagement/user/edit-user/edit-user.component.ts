import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/user';
import { UserService } from 'src/app/services/userServices/user.service';
import { HttpErrorResponse } from '@angular/common/http';

export const passwordValidator: ValidatorFn = (control: AbstractControl) => {
  const value: string = control.value || '';

  // Requiere al menos una letra mayúscula
  const hasUppercase = /[A-Z]/.test(value);

  // Requiere al menos un carácter especial (puedes ajustar la expresión según tus necesidades)
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  // Combinar las condiciones requeridas
  const isValid = hasUppercase && hasSpecialCharacter;

  return isValid ? null : { passwordRequirements: true };
};

export const emailValidator: ValidatorFn = (control: AbstractControl) => {
  const value: string = control.value || '';

  // Verifica si el dominio es "@azucareralagrecia.com"
  const isValidDomain = value.endsWith('@azucareralagrecia.com');

  // Verifica el formato específico de la dirección de correo electrónico
  const isValidFormat = /^[a-zA-Z]+\.[a-zA-Z]+@azucareralagrecia\.com$/.test(value);

  // Combina las condiciones requeridas
  const isValid = Validators.email(control) === null && isValidDomain && isValidFormat;

  return isValid ? null : { emailRequirements: true };
};

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  id!: number;
  user: User | null = null;
  loading: boolean = false;
  myform: FormGroup; // Agrega myform como un FormGroup
  hidePassword = true;
  isChecked: boolean = false;

  constructor(private _userService: UserService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({
      Id: this.id,
      Name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      UserName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      Email: ['', [Validators.required, emailValidator]],
      PhoneNumber: [''],
      IsActive: [false, Validators.required] // Valor inicial establecido en false
    });
  }

  ngOnInit(): void {
    this.obtainUser();
  }

  obtainUser() {
    this.loading = true;
    this._userService.getUser(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.user = data.Data;
          if (this.user) {
            this.myform.patchValue({
              Name: this.user.Name,
              UserName: this.user.UserName,
              Email: this.user.Email,
              PhoneNumber: this.user.PhoneNumber,
              IsActive: this.user.IsActive
            });

            // Ajusta el valor del IsActive en el formulario
            const isActiveControl = this.myform.get('IsActive');
            if (isActiveControl) {
              isActiveControl.setValue(this.user.IsActive);
            }
          } else {
            console.error('El user es nula.');
          }
        } else {
          console.error('El user no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener el user:', error);
      }
    );
  }

  updateUser() {
    if (this.myform && this.myform.valid) {
      if (this.id !== null && this.id !== undefined) {
        const nameControl = this.myform.get('Name');
        const userNameControl = this.myform.get('UserName');
        const emailControl = this.myform.get('Email');
        const phoneNumberControl = this.myform.get('PhoneNumber');
        const isActiveControl = this.myform.get('IsActive')

        if (nameControl && userNameControl && emailControl && phoneNumberControl && isActiveControl) {
          const updatedUser: User = {
            Id: this.id,
            Name: nameControl.value,
            UserName: userNameControl.value,
            Email: emailControl.value,
            PhoneNumber: phoneNumberControl.value || null, // Asigna null si phoneNumberControl.value es null o una cadena vacía
            IsActive: isActiveControl.value
         };

          this.loading = true;
          this._userService.updateUser(updatedUser).subscribe(
            (data: any) => {
              this.loading = false;
              this.toListUser();
              this.mensajeExito('updated');
            },
            (error) => {
              console.error('Error al actualizar el usuario:', error);
              // Agrega esto para obtener más detalles del error
              if (error instanceof HttpErrorResponse) {
                console.error('Detalles del error:', error);
                console.error('Respuesta del servidor:', error.error);
              }
            }
          );
        } else {
          console.error('Los campos del formulario no se encontraron.');
        }
      } else {
        console.error('El ID es nulo o indefinido.');
      }
    } else {
      console.error('El formulario no es válido o es nulo.');
    }
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The user was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  toggleIsActive() {
    const isActiveControl = this.myform.get('IsActive');
    if (isActiveControl) {
      isActiveControl.setValue(!isActiveControl.value);
      console.log('Valor de IsActive después de alternar:', isActiveControl.value);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  isPasswordValid(): boolean {
    return !this.hidePassword || !this.myform.get('Password')?.invalid;
  }


  toListUser() {
    this.router.navigate(['/list-user']);
  }

}
