import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationSection } from 'src/app/interfaces/application/applicationSection';
import { SectionsService } from 'src/app/services/applicationServices/sections.service';

@Component({
  selector: 'app-detail-section',
  templateUrl: './detail-section.component.html',
  styleUrls: ['./detail-section.component.css']
})
export class DetailSectionComponent implements OnInit {
  id!: number;
  section: ApplicationSection | null = null;
  loading: boolean = false;

  constructor(private _sectionServices: SectionsService, private aRoute: ActivatedRoute, private router: Router) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtenerSection();
  }

  obtenerSection() {
    this.loading = true;
    this._sectionServices.getSection(this.id).subscribe(
      (data: any) => {
        if (data.Data) {
          this.section = data.Data;
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
    this.router.navigate(["/list-sections"]);
  }

}
