import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ModulesService } from 'src/app/services/applicationServices/modules.service';

@Component({
  selector: 'app-edit-modules',
  templateUrl: './edit-modules.component.html',
  styleUrls: ['./edit-modules.component.css']
})
export class EditModulesComponent implements OnInit {
  id!: number;
  module: ApplicationModule | null = null;
  application: Application[] = [];
  loading: boolean = false;
  myform: FormGroup;

  constructor(
    private _modulesService: ModulesService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({ 
      Module: ['', Validators.required],
      Code: ['', Validators.required],
      ApplicationId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerModule();
    this.obtenerApplications();
  }

  obtenerApplications() {
    this._modulesService.getApplication().subscribe(
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

  obtenerModule() {
    this.loading = true;
    this._modulesService.getModule(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.module = data.Data;
  
          if (this.module) {
            this.myform.patchValue({
              Module: this.module.Module,
              Code: this.module.Code,
              ApplicationId: this.module.ApplicationId
            });
          } else {
            console.error('El modulo es nulo es nula.');
          }
        } else {
          console.error('El modulo no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener el modulo:', error);
      }
    );
  }

  updateModule() {
    if (this.myform && this.myform.valid) {
      if (this.id !== null && this.id !== undefined) {
        const nameControl = this.myform.get('Module');
        const codeControl = this.myform.get('Code');
        const applicationIdControl = this.myform.get('ApplicationId');
  
        if (nameControl && codeControl && applicationIdControl) {
          const updatedApplicationModule: ApplicationModule = {
            Id: this.id,
            Module: nameControl.value,
            Code: codeControl.value,
            ApplicationId: applicationIdControl.value,
            NameApplication: ''
          };
  
          this.loading = true;
          this._modulesService.updateModule(updatedApplicationModule).subscribe(
            (data: any) => {
              this.loading = false;
              this.toList();
              this.mensajeExito("updated");
            },
            (error) => {
              this.loading = false;
              console.error('Error al actualizar la aplicación:', error);
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

  toList() {
    this.router.navigate(["/list-modules"]);
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The module was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }
}
