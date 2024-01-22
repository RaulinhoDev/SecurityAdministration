import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/user';
import { UserService } from 'src/app/services/userServices/user.service';

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
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  myform: FormGroup;
  hidePassword = true;



  constructor(private _userService: UserService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private router: Router) {
    this.myform = this.fb.group({
      Name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1)]],
      UserName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
      Password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8), passwordValidator]],
      Email: ['', [Validators.required, emailValidator]],
      PhoneNumber: ['']
    })
  }

  ngOnInit(): void {
  }

  addedUser() {
    const user: User = {
      Name: this.myform.value.Name,
      UserName: this.myform.value.UserName,
      Password: this.myform.value.Password,
      Email: this.myform.value.Email,
      PhoneNumber: this.myform.value.PhoneNumber,
      IsActive: true,

    };
    this.addUser(user);
  }

  addUser(user: User) {
    this._userService.addUser(user).subscribe(data => {
      this.mensajeExito('registered');
      this.toListUser();
    })
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The user was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
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
