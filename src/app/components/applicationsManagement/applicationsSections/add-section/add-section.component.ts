import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { SectionsService } from 'src/app/services/applicationServices/sections.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {
  myform: FormGroup;
  module: ApplicationModule[] = [];

  constructor(private _sectionService: SectionsService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private router: Router) {
      this.myform = this.fb.group({
        Code: ['', Validators.required],
        Section: ['', Validators.required],
        ApplicationModuleId: ['', Validators.required]
      })
     }

  ngOnInit(): void {
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

  addedSection() {
    const section: ApplicationSection = {
      Section: this.myform.value.Section,
      Code: this.myform.value.Code,
      ApplicationModuleId: this.myform.value.ApplicationModuleId,
      NameModule: this.myform.value.NameModule
    };
    this.addSection(section);
  }

  addSection(section: ApplicationSection) {
    this._sectionService.addSection(section).subscribe(data => {
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
    this.router.navigate(["/list-sections"]);
  }

}
