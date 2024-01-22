import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/application-user/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.myAppUrl}${this.myApiUrl}GetUserbyId/${id}`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.myAppUrl}${this.myApiUrl}`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.myAppUrl}${this.myApiUrl}User/${user.Id}`, user);
  }

  updateUserIsActive(id: number, isActive: boolean): Observable<User> {
    return this.http.put<User>(`${this.myAppUrl}${this.myApiUrl}User/UpdateStatus/${id}`, { isActive });
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.myAppUrl}${this.myApiUrl}checkEmailExists/${email}`);
  }
  
  checkUserNameExists(userName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.myAppUrl}${this.myApiUrl}checkUserNameExists/${userName}`);
  }
}
