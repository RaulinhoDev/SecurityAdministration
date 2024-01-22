import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  loading: boolean = false;
  currentTab: string = '';

  constructor(private router: Router) { }

  onTabChanged(event: MatTabChangeEvent): void {
    const tabLabel = event.tab.textLabel;
    this.currentTab = tabLabel;

    if (tabLabel === 'Users') {
      this.toRoles();
      
    }
    if (tabLabel === 'Roles') {
      this.toRoleAdministration();
    }
  }

  ngOnInit(): void {
    this.toRoles();
  }

  toRoles() {
    this.router.navigate(['/user-management/list-userRole']);
  }

  toRoleAdministration() {
    this.router.navigate(['/user-management/list-rolePermission']);
  }
}
