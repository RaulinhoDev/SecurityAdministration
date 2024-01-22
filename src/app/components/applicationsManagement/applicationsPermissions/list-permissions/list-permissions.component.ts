import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-list-permissions',
  templateUrl: './list-permissions.component.html',
  styleUrls: ['./list-permissions.component.css']
})
export class ListPermissionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['index', 'name', 'section', 'acciones'];
  section: ApplicationSection[] = [];
  permission: ApplicationPermission[] = [];
  dataSource: MatTableDataSource<ApplicationPermission> = new MatTableDataSource(this.permission);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _servicePermissions: PermissionsService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obtenerPermissions();
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

  obtenerPermissions() {
    this.loading = true;
    this._servicePermissions.getPermissions().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          for (const permission of data.Data) {
            const section = this.section.find(app => app.Id === permission.ApplicationSectionId);
            if (section) {
              permission.ApplicationSectionId = section.Section;
            }
          }
          this.permission = data.Data;
  
          // Actualiza los datos en lugar de crear una nueva instancia
          this.dataSource.data = this.permission;
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

  toAddPermission() {
    this.router.navigate(['/add-permissions']);
  }

  toMenu() {
    this.router.navigate(['/menuApp']);
  }

}
