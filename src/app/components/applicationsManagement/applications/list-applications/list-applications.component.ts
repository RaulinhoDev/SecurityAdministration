import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationsService } from 'src/app/services/applicationServices/applications.service';

@Component({
  selector: 'app-list-applications',
  templateUrl: './list-applications.component.html',
  styleUrls: ['./list-applications.component.css']
})
export class ListApplicationsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'code', 'acciones'];
  applications: Application[] = [];
  dataSource: MatTableDataSource<Application> = new MatTableDataSource(this.applications);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private _applicationsService: ApplicationsService
  ) {}

  ngOnInit(): void {
    this.obtenerAplications();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  obtenerAplications() {
    this.loading = true; 
    this._applicationsService.getApplications().subscribe(
      (data: any) => {
        this.loading = false; 
        if (Array.isArray(data.Data)) {
          this.applications = data.Data;
          this.dataSource = new MatTableDataSource<Application>(this.applications);
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

  toAddApp() {
    this.router.navigate(['/add-applications']); 
  }

  toMenu() {
    this.router.navigate(['/menuApp']);
  }

}
