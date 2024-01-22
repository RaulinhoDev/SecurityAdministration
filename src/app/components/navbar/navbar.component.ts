import { Component} from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  alwaysExpandedClass = 'always-expanded';
  opened=false;

  constructor(private router: Router) {

  }

  selectedSection: string = 'applications'; // por defecto, mostramos la sección de applications

  selectSection(section: string): void {
    this.selectedSection = section;
  }

  onTabChanged(event: MatTabChangeEvent): void {
    const selectedTabLabel = event.tab.textLabel;

    if (selectedTabLabel === 'Applications') {
      this.router.navigate(['/application-management/list-applications']);
    } else if (selectedTabLabel === 'Modules') {
      this.router.navigate(['/application-management/list-modules']);
    } else if (selectedTabLabel === 'Sections') {
      this.router.navigate(['/application-management/list-sections']);
    } else if (selectedTabLabel === 'Permissions') {
      this.router.navigate(['/application-management/list-permissions']);
    } else if (selectedTabLabel === 'Roles') {
      this.router.navigate(['/user-management/list-role']);
    } else if (selectedTabLabel === 'Users') {
      this.router.navigate(['/user-management/list-user']);
    }
  }

  isApplicationsSection(): boolean {
    return this.selectedSection === 'Applications';
  }

  isModulesSection(): boolean {
    return this.selectedSection === 'Modules';
  }

  isSectionsSection(): boolean {
    return this.selectedSection === 'Sections';
  }

  isPermissionsSection(): boolean {
    return this.selectedSection === 'Permissions';
  }

  isRolesSection(): boolean {
    return this.selectedSection === 'Roles';
  }

  isUsersSection(): boolean {
    return this.selectedSection === 'Users';
  }


}