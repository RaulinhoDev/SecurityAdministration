import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user/user';
import { UserRole } from 'src/app/interfaces/user/user-userRole';
import { UserRoleService } from 'src/app/services/userServices/user-role.service';
import { AddUserRoleModalComponent } from '../add-user-role-modal/add-user-role-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserRoleModalComponent } from '../edit-user-role-modal/edit-user-role-modal.component';

@Component({
  selector: 'app-list-user-role',
  templateUrl: './list-user-role.component.html',
  styleUrls: ['./list-user-role.component.css']
})
export class ListUserRoleComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'space', 'role', 'acciones'];
  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource(this.users);

  displayedColumnsUser: string[] = ['name', 'space', 'role'];
  userRole: UserRole[] = [];
  dataSourceUser: MatTableDataSource<UserRole> = new MatTableDataSource(this.userRole);
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _userRoleService: UserRoleService) { }

  ngOnInit(): void {
    this.obtenerUsers();
    this.obtenerUserWithRoles();
  }

  applyFilterUser(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceUser.paginator) {
      this.dataSourceUser.paginator.firstPage();
    }
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

  rolesForUser(user: UserRole): string[] {
    const userId = user.ApplicationUserId;
    const rolesForUser = this.userRole.filter(u => u.ApplicationUserId === userId);
  
    // Filtra los roles diferentes al que estás considerando en el momento
    const otherRoles = rolesForUser
      .filter(role => role.ApplicationRoleId !== user.ApplicationRoleId)
      .map(role => role.RoleName);
  
    return otherRoles;
  }
  
  obtenerUsers() {
    this.loading = true; // Muestra un indicador de carga
    this._userRoleService.getUserRoles().subscribe(
      (data: any) => {
        this.loading = false; // Oculta el indicador de carga
        if (Array.isArray(data.Data)) {
          // Agrupar roles por ApplicationUserId
          const userRolesMap = new Map<number, any>();
  
          data.Data.forEach((user: any) => {
            const userId = user.ApplicationUserId;
  
            if (!userRolesMap.has(userId)) {
              userRolesMap.set(userId, { ...user, Roles: [] });
            }
  
            userRolesMap.get(userId).Roles.push({
              ApplicationRoleId: user.ApplicationRoleId,
              RoleName: user.RoleName
            });
          });
  
          // Convertir el mapa a un array de usuarios agrupados
          this.users = Array.from(userRolesMap.values());
  
          // Resto del código para actualizar la MatTableDataSource y paginator
          this.dataSource = new MatTableDataSource<User>(this.users);
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

  obtenerUserWithRoles() {
    this.loading = true;
    this._userRoleService.getUserRolesWithRoles().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          this.userRole = data.Data;
          this.dataSourceUser.data = this.userRole;
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

  openEditModal(userRole: UserRole): void {
    const dialogRef = this.dialog.open(EditUserRoleModalComponent, {
      data: { userRole },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'saved') {
        // Llama a la función para actualizar la lista después de guardar en el modal
        this.obtenerUserWithRoles();
      }
    });
  }
  

  assignedRolesModal(roleId: number): void {
    const dialogRef = this.dialog.open(AddUserRoleModalComponent, {
      width: '600px',
      height: '570px',
      data: {
        roleId: roleId,
        // Puedes agregar más datos aquí según sea necesario
      }
    });
  
    dialogRef.afterClosed().subscribe(
      (formData: any) => {
        if (formData) {
          // Procesa los datos de la modal según tus necesidades
          this.obtenerUserWithRoles();
          this.obtenerUsers(); // Actualiza la lista de UserRoles después de cerrar la modal
        }
      },
      (error) => {
        console.error('Error al abrir la modal', error);
      }
    );
  }


  assignRoles(roleId: number) {
    this.router.navigate(['/add-userRole/', roleId]);
  }

  

  toUserApp() {
    this.router.navigate(["/userApp"])
  }

  toAddUserRole() {
    this.router.navigate(['/add-userRole'])
  }

  toUsers() {
    this.router.navigate(['/list-user'])
  }

}
