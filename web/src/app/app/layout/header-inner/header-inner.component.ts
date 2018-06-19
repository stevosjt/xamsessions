import { Component } from '@angular/core';
import { AuthService } from 'library';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent {

  constructor(private auth: AuthService, private router: Router) { }

  logout(): void {
    this.auth.logout(true);
    this.router.navigate(['login']);
  }
}
