import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RolePermission } from '../../interfaces/user/user-rolePermission';
import { Role } from '../../interfaces/user/user-role';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';


@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationRolePermission/';
  private myApiextend: string = this.myAppUrl + this.myApiUrl + 'role/';
  private myApiprueba: string = 'role/'
  private myApiRole: string = 'api/applicationRole/';

  constructor(private http: HttpClient) { }


  addRolePermission(roleId: number, permissionIds: number[]): Observable<RolePermission> {
    const rolePermission = {
      ApplicationRoleId: roleId,
      ApplicationPermissionId: permissionIds
    };
  
    return this.http.post<RolePermission>(`${this.myAppUrl}${this.myApiUrl}`, rolePermission);
  }

  getRolesAndPermissions(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getPermissionsByRoleId(roleId: number): Observable<ApplicationPermission[]> {
    return this.http.get<ApplicationPermission[]>(`${this.myAppUrl}${this.myApiRole}${roleId}/permissions`);
  }
  getRoleByName(roleName: string): Observable<Role> {
    return this.http.get<Role>(`${this.myAppUrl}${this.myApiUrl}?roleName=${roleName}`);
  }

  getRolePermission(id: number): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  getRolePermissionByName(roleName: string): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${this.myApiextend}${roleName}`);
  }

  getRolePermissionByRoleId(id: number): Observable<RolePermission> {
    return this.http.get<RolePermission>(`${this.myAppUrl}${this.myApiUrl}${this.myApiprueba}${id}`);
  }

  updateRolePermission(roleId: number, permissionIds: number[]): Observable<RolePermission> {
    const updatedRolePermission = {
      ApplicationRoleId: roleId,
      ApplicationPermissionId: permissionIds,
    };
  
    return this.http.put<RolePermission>(`${this.myAppUrl}${this.myApiUrl}/${roleId}`, updatedRolePermission);
  }
  
  editRolePermission(roleId: number, permissionIds: number[]): Observable<RolePermission> {
    const rolePermission = {
      ApplicationRoleId: roleId,
      ApplicationPermissionId: permissionIds
    };
    const url = `${this.myAppUrl}${this.myApiUrl}${roleId}`;
  
    return this.http.put<RolePermission>(url, rolePermission);
  }
  

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.myAppUrl}${this.myApiRole}`);
  }

  getRole(RoleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.myAppUrl}${this.myApiRole}${RoleId}`);
  }

  getAllRoleWithOrNotPermissions(): Observable<RolePermission[]> {
    return this.http.get<RolePermission[]>(`${this.myAppUrl}${this.myApiUrl}allRolesWithPermissions`);
  }
  
  
}
