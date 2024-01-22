import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.css']
})
export class MenuUserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toHome() {
    this.router.navigate(['/home']); 
  }
  
  toUser(){
    this.router.navigate(["/list-user"])
  }

  toRole() {
    this.router.navigate(["/add-role"])
  }

  toListRolePermission(){
    this.router.navigate(["/list-rolePermission"])
  }
  
  toRolePermission() {
    this.router.navigate(["/add-rolePermission"])
  }

  toUserRole() {
    this.router.navigate(["/list-userRole"])
  }

}
