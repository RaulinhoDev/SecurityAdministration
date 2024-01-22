import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationsService } from 'src/app/services/applicationServices/applications.service';

@Component({
  selector: 'app-add-applications',
  templateUrl: './add-applications.component.html',
  styleUrls: ['./add-applications.component.css']
})
export class AddApplicationsComponent implements OnInit {
  myform: FormGroup;

  constructor(private fb: FormBuilder, private _applicationsService: ApplicationsService,
    private _snackBar: MatSnackBar, private router: Router) {
      this.myform = this.fb.group({
        Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
        Code: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(1)]],
      })
     }

  ngOnInit(): void {
  }

  addedApplication() {
    const application: Application = {
      Name: this.myform.value.Name,
      Code: this.myform.value.Code
    };
    this.addApplication(application);
  }

  addApplication(application: Application) {
    this._applicationsService.addApplication(application).subscribe(data => {
      this.mensajeExito('registered');
      this.toList();
    })
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The application was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  toList() {
    this.router.navigate(['/list-applications']); 
  }

}
