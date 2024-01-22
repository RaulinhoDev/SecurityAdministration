import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from 'src/app/interfaces/user/user-role';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationRole/';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  addRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.myAppUrl}${this.myApiUrl}`, role);
  }

  deleteRole(roleId: number): Observable<void> {
    const url = `${this.myAppUrl}${this.myApiUrl}${roleId}`;
    return this.http.delete<void>(url);
  }
}
