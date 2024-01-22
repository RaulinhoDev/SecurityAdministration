import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationModule } from '../../interfaces/application/applicationModule';
import { Injectable } from '@angular/core';
import { Application } from '../../interfaces/application/application';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationModule/';
  private myApiUrlApp: string = 'api/application/';

  constructor(private http: HttpClient) { }


  addModule(module: ApplicationModule): Observable<ApplicationModule> {
    return this.http.post<ApplicationModule>(`${this.myAppUrl}${this.myApiUrl}`, module);
  }

  getModules(): Observable<ApplicationModule[]> {
    return this.http.get<ApplicationModule[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getModule(id: number): Observable<ApplicationModule> {
    return this.http.get<ApplicationModule>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  updateModule(module: ApplicationModule): Observable<ApplicationModule> {
    return this.http.put<ApplicationModule>(`${this.myAppUrl}${this.myApiUrl}${module.Id}`, module);
  }

  getApplication(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.myAppUrl}${this.myApiUrlApp}`);
  }
}
