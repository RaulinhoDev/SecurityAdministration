import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationPermission } from '../../interfaces/application/applicationPermission';
import { ApplicationSection } from '../../interfaces/application/applicationSection';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationPermission/';
  private myApiSec: string = 'api/applicationSection/';

  constructor(private http: HttpClient) { }

  addPermission(permission: ApplicationPermission): Observable<ApplicationPermission> {
    return this.http.post<ApplicationPermission>(`${this.myAppUrl}${this.myApiUrl}`, permission);
  }

  getPermissions(): Observable<ApplicationPermission[]> {
    return this.http.get<ApplicationPermission[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getPermission(id: number): Observable<ApplicationPermission> {
    return this.http.get<ApplicationPermission>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  getPermissionsByIds(permissionIds: string): Observable<ApplicationPermission[]> {
    // Utiliza encodeURIComponent para asegurarte de que los identificadores estén codificados correctamente
    const encodedPermissionIds = encodeURIComponent(permissionIds);
    return this.http.get<ApplicationPermission[]>(`${this.myAppUrl}${this.myApiUrl}/${encodedPermissionIds}`);
  }

  updateSection(permission: ApplicationPermission): Observable<ApplicationPermission> {
    return this.http.put<ApplicationPermission>(`${this.myAppUrl}${this.myApiUrl}${permission.Id}`, permission);
  }

  getSections(): Observable<ApplicationSection[]> {
    return this.http.get<ApplicationSection[]>(`${this.myAppUrl}${this.myApiSec}`);
  }
}
