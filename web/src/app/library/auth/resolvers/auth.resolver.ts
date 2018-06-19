import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthResolver implements Resolve<any> {
    constructor(private auth: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Promise<any> {
        return this.auth.checkAuthenticationStatus().toPromise();
    }
}
