import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.css']
})
export class AddPermissionComponent implements OnInit {
  myform: FormGroup;
  section: ApplicationSection[] = [];

  constructor(private _permissionService: PermissionsService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private router: Router) {
      this.myform = this.fb.group({
        Permission: ['', Validators.required],
        ApplicationSectionId: ['', Validators.required]
      })
     }

     ngOnInit(): void {
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

    addedPermission() {
      const permission: ApplicationPermission = {
        Permission: this.myform.value.Permission,
        ApplicationSectionId: this.myform.value.ApplicationSectionId,
        NameSection: this.myform.value.NameSection
      };
      this.addPermission(permission);
    }
  
    addPermission(permission: ApplicationPermission) {
      this._permissionService.addPermission(permission).subscribe(data => {
        this.mensajeExito('registered');
        this.toList();
      })
    }
  
    mensajeExito(texto: string) {
      this._snackBar.open(`The section was successfully ${texto}`, '', {
        duration: 4000,
        horizontalPosition: 'right',
      });
    }
  
    toList() {
      this.router.navigate(["/list-permissions"]);
    }

}
