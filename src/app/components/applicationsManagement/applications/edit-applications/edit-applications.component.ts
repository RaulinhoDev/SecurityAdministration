import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa FormBuilder y Validators
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationsService } from 'src/app/services/applicationServices/applications.service';

@Component({
  selector: 'app-edit-applications',
  templateUrl: './edit-applications.component.html',
  styleUrls: ['./edit-applications.component.css']
})
export class EditApplicationsComponent implements OnInit {
  id!: number;
  application: Application | null = null;
  loading: boolean = false;
  myform: FormGroup; // Agrega myform como un FormGroup

  constructor(
    private _applicationsService: ApplicationsService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder // Inyecta FormBuilder
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.myform = this.fb.group({ 
      Name: ['', Validators.required],
      Code: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerApplication(); // Llama a la función para obtener los detalles de la aplicación al inicializar el componente.
  }

  obtenerApplication() {
    this.loading = true;
    this._applicationsService.getApplication(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.application = data.Data;
  
          if (this.application) {
            this.myform.patchValue({
              Name: this.application.Name,
              Code: this.application.Code
            });
          } else {
            console.error('La aplicación es nula.');
          }
        } else {
          console.error('La aplicación no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener la aplicación:', error);
      }
    );
  }

  updateApplication() {
    if (this.myform && this.myform.valid) {
      if (this.id !== null && this.id !== undefined) {
        const nameControl = this.myform.get('Name');
        const codeControl = this.myform.get('Code');
  
        if (nameControl && codeControl) {
          const updatedApplication: Application = {
            Id: this.id,
            Name: nameControl.value,
            Code: codeControl.value
          };
  
          this.loading = true;
          this._applicationsService.updateApplication(updatedApplication).subscribe(
            (data: any) => {
              this.loading = false;
              this.toList(); // Redirige a la lista de aplicaciones después de la edición exitosa.
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
    this.router.navigate(['/list-applications']);
  }
}