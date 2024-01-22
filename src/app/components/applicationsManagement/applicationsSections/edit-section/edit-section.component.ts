import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { SectionsService } from 'src/app/services/applicationServices/sections.service';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.css']
})
export class EditSectionComponent implements OnInit {
  id!: number;
  section: ApplicationSection | null = null;
  module: ApplicationModule[] = [];
  loading: boolean = false;
  myform: FormGroup;

  constructor(
    private _sectionService: SectionsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({
      Section: ['', Validators.required],
      Code: ['', Validators.required],
      ApplicationModuleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerSection();
    this.obtenerModules();
  }

  obtenerModules() {
    this._sectionService.getModules().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.module = data.Data;
        } else if (data.Data) {
          this.module = [data.Data];
        } else {
          console.error('La propiedad "Data" no es un arreglo o un objeto en la respuesta del servicio.');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de aplicaciones:', error);
      }
    );
  }

  obtenerSection() {
    this.loading = true;
    this._sectionService.getSection(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.section = data.Data;
  
          if (this.section) {
            this.myform.patchValue({
              Section: this.section.Section,
              Code: this.section.Code,
              ApplicationModuleId: this.section.ApplicationModuleId
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
  
  updateSection() {
    if (this.myform && this.myform.valid) {
      if (this.id !== null && this.id !== undefined) {
        const sectionControl = this.myform.get('Section');
        const codeControl = this.myform.get('Code');
        const applicationModuleIdControl = this.myform.get('ApplicationModuleId');
  
        if (sectionControl && codeControl && applicationModuleIdControl) {
          const updatedApplicationSection: ApplicationSection = {
            Id: this.id,
            Section: sectionControl.value,
            Code: codeControl.value,
            ApplicationModuleId: applicationModuleIdControl.value,
            NameModule: ''
          };
  
          this.loading = true;
          this._sectionService.updateSection(updatedApplicationSection).subscribe(
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
    this.router.navigate(["/list-sections"]);
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The section was successfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }
}
