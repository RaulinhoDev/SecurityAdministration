import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ModulesService } from 'src/app/services/applicationServices/modules.service';
import { Application } from 'src/app/interfaces/application/application';

@Component({
  selector: 'app-list-modules',
  templateUrl: './list-modules.component.html',
  styleUrls: ['./list-modules.component.css']
})
export class ListModulesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'code', 'application', 'acciones'];
  application: Application[] = [];
  modules: ApplicationModule[] = [];
  dataSource: MatTableDataSource<ApplicationModule> = new MatTableDataSource(this.modules);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _modulesService: ModulesService,
    private router: Router,
    private _snackBar: MatSnackBar
    
  ) { }

  ngOnInit(): void {
    //this.obtenerApplications();
    this.obtenerModules();

  }

  obtenerApplications() {
    this._modulesService.getApplication().subscribe(
      (data: any) => {
        if (Array.isArray(data.Data)) {
          this.application = data.Data;
        } else {
          console.error('La propiedad "Data" no es una matriz en la respuesta del servicio de aplicaciones.');
        }
      },
      (error) => {
        console.error('Error al obtener la lista de aplicaciones:', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items por página'; // Configura la etiqueta de elementos por página
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  globalIndex(i: number): number {
    return i + this.paginator.pageIndex * this.paginator.pageSize + 1;
  }

  /*getApplicationName(applicationId: number): string {
    const application = this.application.find(app => app.Id === applicationId);
    return application ? application.Name : 'No se encontró la aplicación';
  }*/

  obtenerModules() {
    this.loading = true; // Muestra un indicador de carga
    this._modulesService.getModules().subscribe(
      (data: any) => {
        this.loading = false; // Oculta el indicador de carga
        if (Array.isArray(data.Data)) {
          for (const module of data.Data) {
            const application = this.application.find(app => app.Id === module.ApplicationId);
            if (application) {
              module.ApplicationId = application.Name;
            }
          }
          this.modules = data.Data;
  
          this.dataSource = new MatTableDataSource<ApplicationModule>(this.modules);
          this.dataSource.paginator = this.paginator; // Vuelve a enlazar el paginador después de actualizar los datos
        } else {
          console.error('La propiedad "Data" no es una matriz en la respuesta del servicio.');
        }
      },
      (error) => {
        this.loading = false; // En caso de error, asegúrate de ocultar el indicador de carga
        console.error('Error al obtener datos:', error);
      }
    );
  }

  obtenerApplicationss() {
    this._modulesService.getModules().subscribe(
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

  toAddModule() {
    this.router.navigate(['/add-modules']);
  }

  toMenu() {
    this.router.navigate(['/menuApp']);
  }
}
