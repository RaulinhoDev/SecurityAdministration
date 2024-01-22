import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.css']
})
export class EditPermissionComponent implements OnInit {
  id!: number;
  permission: ApplicationPermission | null = null;
  section: ApplicationSection[] = [];
  loading: boolean = false;
  myform: FormGroup;

  constructor(
    private _permissionService: PermissionsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({
      Permission: ['', Validators.required],
      ApplicationSectionId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerPermission();
    this.obtenerSections();
    
  }

  obtenerSections() {
    this._permissionService.getSections().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.section = data.Data;
        } else if (data.Data) {
          this.section = [data.Data];
        } else {
          console.error('La propiedad "Data" no es un arreglo o un objeto en la respuesta del servicio.');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de aplicaciones:', error);
      }
    );
  }

  obtenerPermission() {
    this.loading = true;
    this._permissionService.getPermission(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.permission = data.Data;
  
          if (this.permission) {
            this.myform.patchValue({
              Permission: this.permission.Permission,
              ApplicationSectionId: this.permission.ApplicationSectionId
            });
          } else {
            console.error('la section es nulo es nula.');
          }
        } else {
          console.error('la section no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener la section:', error);
      }
    );
  }

  updatePermission() {
    if (this.myform && this.myform.valid) {
      if (this.id !== null && this.id !== undefined) {
        const permissionControl = this.myform.get('Permission');
        const applicationSectionIdControl = this.myform.get('ApplicationSectionId');
  
        if (permissionControl && applicationSectionIdControl) {
          const updatedApplicationPermission: ApplicationPermission = {
            Id: this.id,
            Permission: permissionControl.value,
            ApplicationSectionId: applicationSectionIdControl.value,
            NameSection: ''
          };
  
          this.loading = true;
          this._permissionService.updateSection(updatedApplicationPermission).subscribe(
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
    this.router.navigate(["/list-permissions"]);
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The permission was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

}
