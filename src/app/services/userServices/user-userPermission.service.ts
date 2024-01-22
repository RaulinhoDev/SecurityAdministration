import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserPermission } from 'src/app/interfaces/user/user-userPermission';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationUserPermission/';
  private myApiUrlextend: string = 'user/'

  constructor(private http: HttpClient) { }

  addUserPermission(userId: number, permissionIds: number[]): Observable<UserPermission> {
    const userPermission = {
      ApplicationUserId: userId,
      ApplicationPermissionId: permissionIds
    };

    return this.http.post<UserPermission>(`${environment.endPoint}${this.myApiUrl}`, userPermission);
  }

  editUserPermission(userId: number, permissionIds: number[]): Observable<UserPermission> {
    const userPermission = {
      ApplicationUserId: userId,
      ApplicationPermissionId: permissionIds
    };
    const url = `${this.myAppUrl}${this.myApiUrl}${userId}`;
  
    return this.http.put<UserPermission>(url, userPermission);
  }

  getUserPermissionByUserId(id: number): Observable<UserPermission> {
    return this.http.get<UserPermission>(`${this.myAppUrl}${this.myApiUrl}${this.myApiUrlextend}${id}`);
  }


}
