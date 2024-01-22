import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'src/app/interfaces/application/application';
import { ApplicationsService } from 'src/app/services/applicationServices/applications.service';

@Component({
  selector: 'app-detail-applications',
  templateUrl: './detail-applications.component.html',
  styleUrls: ['./detail-applications.component.css']
})
export class DetailApplicationsComponent implements OnInit {
  id!: number;
  application: Application | null = null;
  loading: boolean = false;

  constructor(
    private _applicationsService: ApplicationsService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtenerApplication();
  }

  obtenerApplication() {
    this.loading = true;
    this._applicationsService.getApplication(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.application = data.Data;
        } else {
          console.error('La aplicación no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener la aplicación:', error);
      }
    );
  }

  toList() {
    this.router.navigate(['/list-applications']);
  }
}
