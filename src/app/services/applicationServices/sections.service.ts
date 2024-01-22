import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationSection } from '../../interfaces/application/applicationSection';
import { ApplicationModule } from '../../interfaces/application/applicationModule';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  private myAppUrl: string = environment.endPoint;
  private myApiUrl: string = 'api/applicationSection/';
  private myApiMet: string = 'api/applicationModule/';

  constructor(private http: HttpClient) { }


  addSection(section: ApplicationSection): Observable<ApplicationSection> {
    return this.http.post<ApplicationSection>(`${this.myAppUrl}${this.myApiUrl}`, section);
  }

  getSections(): Observable<ApplicationSection[]> {
    return this.http.get<ApplicationSection[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getSection(id: number): Observable<ApplicationSection> {
    return this.http.get<ApplicationSection>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }

  updateSection(section: ApplicationSection): Observable<ApplicationSection> {
    return this.http.put<ApplicationSection>(`${this.myAppUrl}${this.myApiUrl}${section.Id}`, section);
  }

  getModules(): Observable<ApplicationModule[]> {
    return this.http.get<ApplicationModule[]>(`${this.myAppUrl}${this.myApiMet}`);
  }
}
