import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-menu-app',
  templateUrl: './menu-app.component.html',
  styleUrls: ['./menu-app.component.css']
})
export class MenuAppComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  toApp() {
    this.router.navigate(['/list-applications']); 
  }
  toModule() {
    this.router.navigate(['/list-modules']); 
  }
  toSection() {
    this.router.navigate(['/list-sections']); 
  }
  toPermission() {
    this.router.navigate(['/list-permissions']); 
  }
  toHome() {
    this.router.navigate(['/home']); 
  }

}
