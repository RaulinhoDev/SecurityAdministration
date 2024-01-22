import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from '../../interfaces/application/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/application/';

  constructor(private http: HttpClient) { }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getApplication(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.myAppUrl}${this.myApiUrl}`, application);
  }

  updateApplication(application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.myAppUrl}${this.myApiUrl}${application.Id}`, application);
  }

}
