import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private sidenav!: MatSidenav;

  setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  open(): void {
    if (this.sidenav) {
      this.sidenav.open();
    }
  }

  close(): void {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
}