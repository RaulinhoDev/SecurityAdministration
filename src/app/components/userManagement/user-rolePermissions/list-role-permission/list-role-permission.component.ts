import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RolePermission } from 'src/app/interfaces/user/user-rolePermission';
import { RoleService } from 'src/app/services/userServices/role.service';
import { RolePermissionService } from 'src/app/services/userServices/role-permission.service';
import { MatDialog } from '@angular/material/dialog';
import { ListPermissionModalComponent } from '../list-permission-modal/list-permission-modal.component';
import { Role } from 'src/app/interfaces/user/user-role';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmAddPermissionModalComponent } from '../confirm-add-permission-modal/confirm-add-permission-modal.component';
import { DeleteRoleModalComponent } from '../../user-roles/delete-role-modal/delete-role-modal.component';

@Component({
  selector: 'app-list-role-permission',
  templateUrl: './list-role-permission.component.html',
  styleUrls: ['./list-role-permission.component.css']
})
export class ListRolePermissionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['role', 'actions'];
  dataSource: MatTableDataSource<RolePermissionGroup> = new MatTableDataSource();
  displayedColumnsRole: string[] = ['role', 'havePermissions', 'actions'];
  roles: Role[] = [];
  dataSourceRole: MatTableDataSource<Role> = new MatTableDataSource<Role>([]);
  showAddRoleFormFlag: boolean = false;
  newRoleForm!: FormGroup;

  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _rolePermissionService: RolePermissionService,
    private _roleService: RoleService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.obtenerRolePermissions();
    this.obtenerRolesWithPermissions();
    this.buildNewRoleForm();
    this.obtenerRoles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  globalIndex(i: number): number {
    return i + this.paginator.pageIndex * this.paginator.pageSize + 1;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterRole(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRole.filter = filterValue.trim().toLowerCase();
  }

  obtenerRolePermissions() {
    this.loading = true;
    this._rolePermissionService.getRolesAndPermissions().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          const groupedRoles = this.groupRoles(data.Data);
          this.dataSource.data = groupedRoles;
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

  obtenerRoles() {
    this.loading = true;
    this._rolePermissionService.getRoles().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          this.roles = data.Data;
          this.dataSourceRole.data = this.roles;
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

  obtenerRolesWithPermissions() {
    this.loading = true;
    this._rolePermissionService.getAllRoleWithOrNotPermissions().subscribe(
      (data: any) => {
        this.loading = false;
        if (Array.isArray(data.Data)) {
          this.roles = data.Data;
          this.dataSourceRole.data = this.roles;
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

  private buildNewRoleForm() {
    this.newRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
    });
  }

  onSubmitNewRole() {
    // Verifica si el formulario es válido antes de enviarlo al servidor
    if (this.newRoleForm.valid) {
      const newRole: Role = {
        RoleName: this.newRoleForm.value.roleName,
      };
  
      // Utiliza el servicio para agregar el nuevo rol
      this._roleService.addRole(newRole).subscribe(
        (result) => {
          this.newRoleForm.reset();
          this.showAddRoleFormFlag = false;
          // Actualiza la lista de roles para reflejar el nuevo rol
          this.obtenerRolesWithPermissions();
          this.mensajeExito('registered')
        },
        (error) => {
          // Lógica para manejar errores en la creación del rol, si es necesario
          console.error('Error al agregar nuevo rol:', error);
        }
      );
    }
  }

  toggleAddRoleForm() {
    this.showAddRoleFormFlag = !this.showAddRoleFormFlag;
  }

  assignPermissions(roleId: number) {
    this.router.navigate(['/user-management/add-rolePermission', roleId]);
  }

  openPermissionModal(role: RolePermissionGroup): void {
    const permissions = role.Permissions || []; 
    const dialogRef = this.dialog.open(ListPermissionModalComponent, {
      width: '300px',
      data: {
        roleName: role.RoleName,
        permissions: permissions,
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // Agrupa roles por nombre
  private groupRoles(roles: RolePermission[]): RolePermissionGroup[] {
    const groupedRoles: RolePermissionGroup[] = [];
    const roleIds: number[] = [];
  
    roles.forEach(role => {
      const index = roleIds.indexOf(role.ApplicationRoleId);
      if (index === -1) {
        roleIds.push(role.ApplicationRoleId);
        groupedRoles.push({
          ApplicationRoleId: role.ApplicationRoleId,
          RoleName: role.RoleName,
          Permissions: [role.PermissionName],
          ApplicationPermissionIds: [role.ApplicationPermissionId]
        });
      } else {
        groupedRoles[index].Permissions.push(role.PermissionName);
        groupedRoles[index].ApplicationPermissionIds.push(role.ApplicationPermissionId);
        
      }
    });
    return groupedRoles;
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`The role was succesfully ${texto}`, '', {
      duration: 4000,
      horizontalPosition: 'right',
    });
  }

  toMenuUser() {
    this.router.navigate(["/userApp"])
  }

  editRolePermission(id: number): void {
    this.router.navigate(['/user-management/edit-rolePermission/', id]);
  }

  deleteRole(element: any) {
    const dialogRef = this.dialog.open(DeleteRoleModalComponent, {
      data: {
        roleName: element.RoleName
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // Lógica para eliminar el rol
        this._roleService.deleteRole(element.RoleId).subscribe(
          () => {
            this.obtenerRolesWithPermissions();
            this.mensajeExito(`removed`);
          },
          (error) => {
            console.error('Error al eliminar el rol:', error);
            // Manejar errores adicionales si es necesario
          }
        );
      }
    });
  }

  accion2(element: any) {
    // Lógica para la acción 2
    console.log('Realizando Acción 2 para:', element);
    // Puedes agregar aquí la lógica específica que deseas ejecutar para la acción 2
  }
}

interface RolePermissionGroup {
  ApplicationRoleId: number;
  RoleName: string;
  Permissions: string[];
  ApplicationPermissionIds: number[]; // Agrega esta línea
}

