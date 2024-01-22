import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface TabsToRoutes {
  [key: string]: string;
}

@Component({
  selector: 'app-application-management',
  templateUrl: './application-management.component.html',
  styleUrls: ['./application-management.component.css']
})
export class ApplicationManagementComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Iniciar en la pestaña 'Applications'
    this.toApplications();
  }

  onTabChanged(event: MatTabChangeEvent): void {
    const tabLabel = event.tab.textLabel;
    this.navigateToTab(tabLabel);
  }

  navigateToTab(tabLabel: string): void {
    // Utilizar las rutas principales en lugar de manipular directamente el router
    switch (tabLabel) {
      case 'Applications':
        this.toApplications();
        break;
      case 'Modules':
        this.toModules();
        break;
      case 'Sections':
        this.toSections();
        break;
      case 'Permissions':
        this.toPermissions();
        break;
    }
  }

  toApplications(): void {
    this.router.navigate(['/application-management/list-applications']);
  }

  toModules(): void {
    this.router.navigate(['/application-management/list-modules']);
  }

  toSections(): void {
    this.router.navigate(['/application-management/list-sections']);
  }

  toPermissions(): void {
    this.router.navigate(['/application-management/list-permissions']);
  }
}

