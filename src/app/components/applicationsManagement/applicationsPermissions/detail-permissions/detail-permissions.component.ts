import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPermission } from 'src/app/interfaces/application/applicationPermission';
import { PermissionsService } from 'src/app/services/applicationServices/permissions.service';

@Component({
  selector: 'app-detail-permissions',
  templateUrl: './detail-permissions.component.html',
  styleUrls: ['./detail-permissions.component.css']
})
export class DetailPermissionsComponent implements OnInit {
  id!: number;
  permission: ApplicationPermission | null = null;
  loading: boolean = false;

  constructor(
    private _permissionsService: PermissionsService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtenerPermission();
  }

  obtenerPermission() {
    this.loading = true;
    this._permissionsService.getPermission(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.permission = data.Data;
        } else {
          console.error('el permiso no se encontró.');
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error al obtener el permiso:', error);
      }
    );
  }

  toListPermission() {
    this.router.navigate(['/list-permissions']);
  }

}
