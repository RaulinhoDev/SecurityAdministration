import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { User } from 'src/app/interfaces/user/user';
import { Role } from 'src/app/interfaces/user/user-role';
import { UserRole } from 'src/app/interfaces/user/user-userRole';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationUserRole/';
  private myApiUrlextend: string = 'userRole/';
  private myApiUser: string = 'api/application-user/';
  private myApiRole: string = 'api/applicationRole/';

  userRoleUpdated = new Subject<void>();
  userRoleSaved = new Subject<void>();

  constructor(private http: HttpClient) { }


  addUserRole(userRole: UserRole): Observable<UserRole> {
    return this.http.post<UserRole>(`${this.myAppUrl}${this.myApiUrl}`, userRole);
  }

  getUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getUserRole(id: number): Observable<UserRole> {
    return this.http.get<UserRole>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  getUserRoleByUserId(id: number): Observable<UserRole> {
    return this.http.get<UserRole>(`${this.myAppUrl}${this.myApiUrl}${this.myApiUrlextend}${id}`);
  }

  getUserRolesWithRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.myAppUrl}${this.myApiUrl}allUsersWithRoles`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.myAppUrl}${this.myApiRole}`);
  }
  
  
  getUsersForAutocomplete(): Observable<User[]> {
    return this.http.get<{ Message: string, Data: User[] }>(`${this.myAppUrl}${this.myApiUser}`).pipe(
      map(response => response.Data)
    );
  }

  private userRoleUpdatedSource = new Subject<void>();
  userRoleUpdated$ = this.userRoleUpdatedSource.asObservable();

  emitUserRoleUpdated() {
    this.userRoleUpdatedSource.next();
  }

  updateUserRole(userRole: UserRole): Observable<UserRole> {
    return this.http.put<UserRole>(`${this.myAppUrl}${this.myApiUrl}${userRole.Id}`, userRole);
  }

  deleteUserRole(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

}
