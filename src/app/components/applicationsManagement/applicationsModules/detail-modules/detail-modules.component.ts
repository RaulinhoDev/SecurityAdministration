import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationModule } from 'src/app/interfaces/application/applicationModule';
import { ModulesService } from 'src/app/services/applicationServices/modules.service';

@Component({
  selector: 'app-detail-modules',
  templateUrl: './detail-modules.component.html',
  styleUrls: ['./detail-modules.component.css']
})
export class DetailModulesComponent implements OnInit {
  id!: number;
  module: ApplicationModule | null = null;
  loading: boolean = false;

  constructor(private _moduleServices: ModulesService, private aRoute: ActivatedRoute, private router: Router) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtenerModule();
  }

  obtenerModule() {
    this.loading = true;
    this._moduleServices.getModule(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.module = data.Data;
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
    this.router.navigate(["/list-modules"]);
  }

}
