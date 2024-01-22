import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ModulesService } from 'src/app/services/applicationServices/modules.service';

@Component({
  selector: 'app-add-modules',
  templateUrl: './add-modules.component.html',
  styleUrls: ['./add-modules.component.css']
})
export class AddModulesComponent implements OnInit {
  myform: FormGroup;
  application: Application[] = [];

  constructor(private _modulesServices: ModulesService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private router: Router) {
      this.myform = this.fb.group({
        Code: ['', Validators.required],
        Module: ['', Validators.required],
        ApplicationId: ['', Validators.required]
      })
     }

  ngOnInit(): void {
    this.obtenerApplications();
  }

  obtenerApplications() {
    this._modulesServices.getApplication().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.application = data.Data;
        } else if (data.Data) {
          this.application = [data.Data];
        } else {
          console.error('La propiedad "Data" no es un arreglo o un objeto en la respuesta del servicio.');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de aplicaciones:', error);
      }
    );
  }

  addedModule() {
    const module: ApplicationModule = {
      Module: this.myform.value.Module,
      Code: this.myform.value.Code,
      ApplicationId: this.myform.value.ApplicationId,
      NameApplication: this.myform.value.NameApplication
    };
    this.addModule(module);
  }

  addModule(module: ApplicationModule) {
    this._modulesServices.addModule(module).subscribe(data => {
      this.mensajeExito('registered');
      this.toList();
    })
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The module was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  toList() {
    this.router.navigate(["/list-modules"]);
  }

}
