import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError, of } from 'rxjs'; import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable()
export class AuthGuard {

  constructor(private router: Router, private auth: AuthService, private storage: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isAuthenticated()) {
        return this.auth.checkUserAuth(route.data.roles);
    } else {
        if (this.storage.getAuthToken()) {
            const result = this.auth.checkUserAuth(route.data.roles);
            if (!result) {
              return result;
            }
            const status = this.auth.checkAuthenticationStatus();
            if (!status) {
                this.router.navigate(['/login']);
            }
            return status;
        } else {
            this.router.navigate(['/login']);
            return of(false);
        }
    }
  }

}
