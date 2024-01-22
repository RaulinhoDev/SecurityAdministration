import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { User } from 'src/app/interfaces/user/user';
import { UserRole } from 'src/app/interfaces/user/user-userRole';
import { ModulesService } from 'src/app/services/applicationServices/modules.service';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';
import { SectionsService } from 'src/app/services/applicationServices/sections.service';
import { RolePermissionService } from 'src/app/services/userServices/role-permission.service';
import { UserRoleService } from 'src/app/services/userServices/user-role.service';
import { UserService } from 'src/app/services/userServices/user.service';
import { EditUserRoleModalComponent } from '../../user-userRole/edit-user-role-modal/edit-user-role-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AddUserRoleModalComponent } from '../../user-userRole/add-user-role-modal/add-user-role-modal.component';
import { DeleteUserRoleModalComponent } from '../../user-userRole/delete-user-role-modal/delete-user-role-modal.component';
import { UserPermissionService } from 'src/app/services/userServices/user-userPermission.service';
import { AddUserPermissionModalComponent } from '../../user-userPermission/add-user-permission-modal/add-user-permission-modal.component';
import { EditUserPermissionModalComponent } from '../../user-userPermission/edit-user-permission-modal/edit-user-permission-modal.component';
import { ExportOptionModalComponent } from '../../user-userPermission/export-option-modal/export-option-modal.component';
import { ExcelService } from 'src/app/services/userServices/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
  id!: number;
  user: User | null = null;
  userRole: UserRole | null = null;
  userPermission: any[] = [];
  public rolePermissions: any[] = [];
  nameSections: string[] = [];
  nameSectionsSet: Set<string> = new Set();
  modules: { ApplicationModuleId: number, NameModule: string }[] = [];
  modulesSet: Set<{ ApplicationModuleId: number, NameModule: string }> = new Set();
  applicationNamesSet: Set<string> = new Set();
  loading: boolean = false;
  userRoleIdToDelete: number | null = null;
  showDeleteModal: boolean = false;
  location: any;


  constructor(private _userService: UserService,
    private _userRoleService: UserRoleService,
    private _permissionService: PermissionsService,
    private _rolePermissionService: RolePermissionService,
    private _userPermissionService: UserPermissionService,
    private _sectionService: SectionsService,
    private _moduleService: ModulesService,
    private _excelService: ExcelService,
    private aRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtainUser();
    this.obtainUserRole();
    this.obtainUserPermission();
  }

  obtainUser() {
    this.loading = true;
    this._userService.getUser(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.user = data.Data;
        } else {
          console.error('El usuario no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  openAddUserRoleModal() {
    const dialogRef = this.dialog.open(AddUserRoleModalComponent, {
      width: '600px',
      height: '570px',
      data: { roleId: this.id }
    });

    dialogRef.componentInstance.userRoleSaved.subscribe(() => {
      this.handleUserRoleSaved();
    });
  }

  handleUserRoleSaved() {
    window.location.reload();
  }

  openEditUserRoleModal() {
    const dialogRef = this.dialog.open(EditUserRoleModalComponent, {
      width: '400px', // Puedes ajustar el ancho según tus necesidades
      data: { userRole: this.userRole },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {

        // Realizar acciones después de guardar si es necesario
      }
    });
  }

  obtainUserRole() {
    this.loading = true;
    this._userRoleService.getUserRoleByUserId(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.userRole = data.Data;
          this.userRoleIdToDelete = this.userRole?.Id !== undefined ? this.userRole.Id : null;

          if (this.userRole && this.userRole.ApplicationRoleId !== undefined) {
            this.getPermissionsByRoleId(this.userRole.ApplicationRoleId);
          } else {
            this.loading = false;
          }
        } else {
          console.error('El rol no se encontró.');
          this.userRole = null;
          this.loading = false;
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener el rol:', error);
      }
    );
  }

  obtainUserPermission() {
    this.loading = true;
    this._userPermissionService.getUserPermissionByUserId(this.id).subscribe(
      (data: any) => {
        this.userPermission = Array.isArray(data.Data) ? data.Data : [];

        // Iterar sobre los permisos del usuario
        this.userPermission.forEach((userPermission: any) => {
          // Verificar si PermissionId está definido
          if (userPermission.ApplicationPermissionId !== undefined) {
            // Llamar a la función para obtener información adicional de Permission
            this.getPermissionById(userPermission.ApplicationPermissionId);
          }
        });

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener los permisos:', error);
      }
    );
  }


  exportData(): void {
    if (this.user && this.userRole && this.userPermission && this.rolePermissions && (this.userPermission.length > 0 || this.rolePermissions.length > 0)) {
      const fileName = `Datos de ${this.user.Name}`;

      const userProperties = {
        Nombre: this.user.Name,
        Código: this.user.UserName,
        Email: this.user.Email,
        Teléfono: this.user.PhoneNumber,
        Estado: this.user.IsActive ? 'Activo' : 'Inactivo',
      };

      // Mapear rolePermissions y userPermissions de manera intercalada
      const allDataToExport: any[] = [];
      const maxLength = Math.max(this.userPermission.length, this.rolePermissions.length);

      for (let i = 0; i < maxLength; i++) {
        const rolePermission = this.rolePermissions[i];
        const userPermission = this.userPermission[i];

        if (rolePermission) {
          allDataToExport.push({
            ...userProperties,
            Rol: this.userRole.RoleName,
            PermisoRol: rolePermission.PermissionName,
            PermisoUsuario: userPermission ? userPermission.PermissionName : '',
          });
        } else if (userPermission) {
          allDataToExport.push({
            ...userProperties,
            PermisoUsuario: userPermission.PermissionName,
          });
        }
      }
      // Mostrar el modal de opciones de exportación
      const dialogRef = this.dialog.open(ExportOptionModalComponent, {
        data: { fileName: fileName },
      });

      // Suscribirse al resultado del modal
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'excel') {
          // Exportar a Excel
          this._excelService.exportToExcel(allDataToExport, fileName, 'Datos Generales');
        } else if (result === 'pdf') {
          // Exportar a PDF
          this.exportToPDF(allDataToExport, fileName);
        }
      });
    } else {
      console.log("No hay datos para exportar.");
    }
  }

  exportToPDF(data: any[], fileName: string): void {
    const doc = new jsPDF.default();
    const header = Object.keys(data[0]);

    // Agregar un logo
    const logoUrl = 'assets/lagrecia.png';
    doc.addImage(logoUrl, 'PNG', 10, 10, 30, 10); // X, Y, Ancho, Alto

    // Ajustar la posición de las columnas
    const columns = {
      Nombre: 50,
      Código: 80,
      Email: 110,
      Teléfono: 140,
      Estado: 170,
      Rol: 200,
      PermisoRol: 230,
      PermisoUsuario: 260,
    };

    // Ajustar el estilo de la fuente
    doc.setFont('helvetica');
    doc.setFontSize(12);

    doc.text(`Datos de ${this.user?.Name}`, 50, 30);

    // Usar autoTable como un plugin
    (doc as any).autoTable({
      head: [header],
      body: data.map(obj => header.map(key => obj[key])),
      startY: 40,
      theme: 'grid',
      columnStyles: columns,
      styles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      headStyles: { fillColor: [120, 120, 120], textColor: [255, 255, 255], fontSize: 8 },
      bodyStyles: { fontSize: 9 }, // Tamaño de la fuente en el contenido de la tabla
      margin: { top: 60 }, // Posición para evitar solapamiento con el logo
    });

    // Agregar el mensaje al final de la lista
    const message = "Proporcionado por el equipo de desarrollo - IT Software";
    const textWidth = doc.getTextWidth(message);
    const textX = (doc.internal.pageSize.width - textWidth) / 2;
    const finalY = (doc as any).autoTable.previous.finalY;

    // Agregar el texto
    doc.text(`Recurso proporcionado por el equipo de desarrollo - IT Software`, 50, finalY + 20);

    doc.save(`${fileName}.pdf`);
  }

  canExportData(): boolean {
    return !((this.userRole && this.userRole.Id !== undefined) || 
             (Array.isArray(this.userPermission) && this.userPermission.length > 0));
  }

  openEditUserPermissionModal() {
    const dialogRef = this.dialog.open(EditUserPermissionModalComponent, {
      data: {
        userId: this.id,
        permissions: this.userPermission.map(permission => permission.PermissionName) // Solo los nombres de permisos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
      } else if (result === 'cancelled') {
      }
    });
  }

  openAddUserPermissionModal() {
    const dialogRef = this.dialog.open(AddUserPermissionModalComponent, {
      data: {
        userId: this.id,
        userName: this.user?.Name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        window.location.reload()
        console.log('Agregación confirmada');
      } else if (result === 'cancelled') {
        console.log('Agregación cancelada');
      }
    });
  }

  toEditRole() {
    // Asegúrate de tener el ID necesario, en este caso, ApplicationRoleId
    const applicationRoleId = this.userRole?.ApplicationRoleId;

    if (applicationRoleId !== undefined) {
      this.router.navigate(['edit-rolePermission/', applicationRoleId]);
    } else {
      console.error('No se pudo obtener el ApplicationRoleId');
    }
  }

  toEditUser() {
    if (this.id !== null) {
      // Navegar a la página de edición y pasar el Id como parámetro
      this.router.navigate(['/edit-user', this.id]);
    } else {
      console.error('El ID es nulo. No se puede navegar a la página de edición.');
    }
  }

  DeleteUserRoleModal(): void {
    if (this.userRole && this.userRole.Id) {
      const dialogRef = this.dialog.open(DeleteUserRoleModalComponent, {
        width: '400px', // Ajusta el ancho según tus necesidades
        data: { userRoleId: this.userRole.Id, userName: this.userRole.Name },  // Pasar la información necesaria al modal
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirmed') {
          this.eliminarUserRole(); // Llamamos al método para eliminar el UserRole
        } else if (result === 'cancelled') {
        }
      });
    } else {
      console.error('No se puede abrir la modal de eliminación. El UserRole o su Id es nulo o indefinido.');
    }
  }

  eliminarUserRole(): void {
    // Verifica si hay un Id válido en userRoleIdToDelete antes de intentar eliminar
    if (this.userRoleIdToDelete !== null && this.userRoleIdToDelete !== undefined) {
      this.loading = true;

      // Llama a tu servicio para eliminar el UserRole por su ID (this.userRoleIdToDelete)
      this._userRoleService.deleteUserRole(this.userRoleIdToDelete).subscribe(
        () => {
          console.log('UserRole eliminado exitosamente');
          this.loading = false;
          // Realiza acciones adicionales si es necesario

          // Recargar la página después de eliminar el UserRole
          window.location.reload();
        },
        (error) => {
          console.error('Error al eliminar UserRole:', error);
          this.loading = false;
          // Maneja el error según tus necesidades
        }
      );
    } else {
      console.error('El Id de UserRole es nulo o indefinido. No se puede realizar la eliminación.');
      // Puedes manejar esta situación de acuerdo a tus necesidades
    }
  }

  getPermissionsByRoleId(applicationRoleId: number) {
    this._rolePermissionService.getRolePermissionByRoleId(applicationRoleId).subscribe(
      (data: any) => {
        if (data.Data) {
          this.rolePermissions = data.Data;

          if (this.rolePermissions && this.rolePermissions.length > 0) {
            const permissionIds = this.rolePermissions.map((rolePermission: any) => rolePermission.ApplicationPermissionId);

            permissionIds.forEach((permissionId: number) => {
              this.getPermissionById(permissionId);
            });
          } else {
            console.error('No se encontraron permisos para el rol.');
          }
        } else {
          console.error('No se encontraron permisos para el rol.');
          this.rolePermissions = [];
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener los permisos:', error);
      }
    );
  }

  getPermissionById(permissionId: number) {
    this._permissionService.getPermission(permissionId).subscribe(
      (response: any) => {
        if (response.Data) {
          const permission = response.Data;

          // Agrega el NameSection al conjunto
          this.nameSectionsSet.add(permission.NameSection);

          // Llama a la función para obtener información adicional de ApplicationSection
          this.getApplicationSectionInfo(permission.ApplicationSectionId);
        } else {
          console.error('La respuesta del servicio no contiene datos válidos.');
        }
      },
      (error) => {
        console.error('Error al obtener el permiso con ID', permissionId, ':', error);
      }
    );
  }

  sectionInfoArray: ApplicationSection[] = [];

  getApplicationSectionInfo(applicationSectionId: number) {
    this._sectionService.getSection(applicationSectionId).subscribe(
      (response: any) => {
        if (response.Data) {
          const sectionInfo: ApplicationSection = response.Data;

          const applicationModuleId = sectionInfo.ApplicationModuleId;
          const nameModule = sectionInfo.NameModule;

          const existingModule = Array.from(this.modulesSet).find(module => module.ApplicationModuleId === applicationModuleId);

          if (!existingModule) {
            this.modulesSet.add({ ApplicationModuleId: applicationModuleId, NameModule: nameModule });
          }

          this.sectionInfoArray.push(sectionInfo);

          this.getModuleDetails(applicationModuleId);
        } else {
          console.error('La respuesta del servicio ApplicationSection no contiene datos válidos.');
        }
      },
      (error) => {
        console.error('Error al obtener información de ApplicationSection con ID', applicationSectionId, ':', error);
      }
    );
  }

  moduleDetailsArray: { ApplicationId: number, NameApplication: string, Modules: { Module: string, Sections: ApplicationSection[] }[] }[] = [];

  getModuleDetails(applicationModuleId: number) {
    this._moduleService.getModule(applicationModuleId).subscribe(
      (data: any) => {
        if (data.Data) {
          const moduleDetails: { ApplicationId: number, NameApplication: string, Module: string } = data.Data;

          // Busca si ya existe la aplicación en moduleDetailsArray
          const existingApplication = this.moduleDetailsArray.find(app => app.ApplicationId === moduleDetails.ApplicationId);

          if (!existingApplication) {
            // Si no existe, agrega la aplicación con el primer módulo y sus secciones
            this.moduleDetailsArray.push({
              ApplicationId: moduleDetails.ApplicationId,
              NameApplication: moduleDetails.NameApplication,
              Modules: [{
                Module: moduleDetails.Module,
                Sections: this.getUniqueSectionsForModule(applicationModuleId, moduleDetails.Module)
              }]
            });
          } else {
            // Si ya existe, busca el módulo actual
            const existingModule = existingApplication.Modules.find(m => m.Module === moduleDetails.Module);

            if (!existingModule) {
              // Si no existe, agrega el módulo con sus secciones únicas
              existingApplication.Modules.push({
                Module: moduleDetails.Module,
                Sections: this.getUniqueSectionsForModule(applicationModuleId, moduleDetails.Module)
              });
            }
          }
        } else {
          console.error('La respuesta del servicio Module no contiene datos válidos.');
        }
      },
      (error) => {
        console.error('Error al obtener detalles del módulo con ID', applicationModuleId, ':', error);
      }
    );
  }

  getUniqueSectionsForModule(applicationModuleId: number, moduleName: string): ApplicationSection[] {
    // Filtra las secciones únicas para el módulo
    const uniqueSections: ApplicationSection[] = [];
    const addedSectionIds: Set<number> = new Set();

    this.sectionInfoArray
      .filter(section => section.ApplicationModuleId === applicationModuleId)
      .forEach(section => {
        // Verifica si ya hemos agregado esta sección (evita duplicados)
        if (!addedSectionIds.has(section.Id || 0)) {
          addedSectionIds.add(section.Id || 0);
          uniqueSections.push(section);
        }
      });

    return uniqueSections;
  }

  getSectionsFromSectionInfo(applicationModuleId: number): ApplicationSection[] {
    return this.sectionInfoArray.filter(section => section.ApplicationModuleId === applicationModuleId);
  }

  ObtainUserPermission() {

  }

  toListUser() {
    this.router.navigate(['/list-user']);
  }
}

export interface SectionDetails {
  ApplicationModuleId: number;
  Module: string;
  SectionId: number;
  SectionName: string;
}