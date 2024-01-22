import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { SectionsService } from 'src/app/services/applicationServices/sections.service';

@Component({
  selector: 'app-list-sections',
  templateUrl: './list-sections.component.html',
  styleUrls: ['./list-sections.component.css']
})
export class ListSectionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'code', 'module', 'acciones'];
  module: ApplicationModule[] = [];
  section: ApplicationSection[] = [];
  dataSource: MatTableDataSource<ApplicationSection> = new MatTableDataSource(this.section);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _serviceSections: SectionsService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obtenerSections();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Items por página';
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

  obtenerSections() {
    this.loading = true;
    this._serviceSections.getSections().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          for (const section of data.Data) {
            const module = this.module.find(app => app.Id === section.ApplicationModuleId);
            if (module) {
              section.ApplicationId = module.Module;
            }
          }
          this.section = data.Data;
  
          // Actualiza los datos en lugar de crear una nueva instancia
          this.dataSource.data = this.section;
          this.dataSource.paginator = this.paginator;
        } else {
          console.error('La propiedad "Data" no es una matriz en la respuesta del servicio.');
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener datos:', error);
      }
    );
  }

  toAddSection() {
    this.router.navigate(['/add-sections']);
  }

  toMenu() {
    this.router.navigate(['/menuApp']);
  }
}