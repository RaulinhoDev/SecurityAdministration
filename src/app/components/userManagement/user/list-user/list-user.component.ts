import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/user';
import { UserService } from 'src/app/services/userServices/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'spacee', 'username', 'email', 'space', 'status',  'acciones'];
  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource(this.users);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.obtenerUsers();
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

  obtenerUsers() {
    this.loading = true; // Muestra un indicador de carga
    this._userService.getUsers().subscribe(
      (data: any) => {
        this.loading = false; // Oculta el indicador de carga
        if (Array.isArray(data.Data)) {
          this.users = data.Data.map((user: any) => ({
            ...user,
            status: user.IsActive ? 'Active' : 'Inactive'
          }));
          this.dataSource = new MatTableDataSource<User>(this.users);
          this.dataSource.paginator = this.paginator;
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
  

  toUserApp() {
    this.router.navigate(["/userApp"])
  }

  toAddUser() {
    this.router.navigate(["/add-user"])
  }

}
