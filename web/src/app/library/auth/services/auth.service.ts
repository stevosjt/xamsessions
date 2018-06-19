import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, throwError, of } from 'rxjs'; import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { StorageService } from './storage.service';
import { RequestService } from './request.service';
import { IRegister } from '../models/register.model';
import { IPasswordChange } from '../models/password-change.model';
import { IUser } from '../models/user.model';

@Injectable()
export class AuthService {

    public currentUser: IUser;
    public displayName: string;
    jwtHelper = new JwtHelperService();
    displayNameChange: Subject<string> = new Subject<string>();
    constructor(
        private router: Router,
        private http: Http,
        private storage: StorageService,
        private request: RequestService
    ) { }


    loginUser(email: string, password: string): Observable<any> {
        const options = this.request.getAuthOptions(false);
        const loginInfo = { email: email, password: password };

        return this.http.post(environment.baseUrl + '/api/auth/token', JSON.stringify(loginInfo), options).pipe(map(resp => {
            if (resp) {
                this.currentUser = <IUser>resp.json();
                this.displayName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
                this.storage.setAuthToken(resp);
            }
        }), catchError(error => {
            if (error._body instanceof ProgressEvent) {
                return throwError('Error connecting to server');
            }
            return throwError(error._body);
        }));
    }

    updateUserName(name: string) {
        if (this.currentUser) {
            this.currentUser.userName = name;
            this.displayName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
            this.displayNameChange.next(this.displayName);
        }
    }

    changePassword(newPass: IPasswordChange): Observable<any> {
        const options = this.request.getAuthOptions(true);
        return this.http.post(environment.baseUrl + '/api/auth/changepassword', newPass, options).pipe(map((response: Response) => {
            return response;
        }), catchError(error => {
          return throwError(error);
        }));
    }

    //  Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser(): Observable<IUser> {
        return of(this.currentUser);
    }

    // Check if user is authenticated against the server (On browser refresh)
    checkAuthenticationStatus(): Observable<any> {
        if (this.storage.getAuthToken()) {
            const options = this.request.getAuthOptions(true);
            return this.http.get(environment.baseUrl + '/api/auth/currentuser', options).pipe(map((response: any) => {
                if (response._body) {
                    this.currentUser = response.json();
                    this.displayName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
                    return true;
                } else {
                    this.storage.removeAuthToken();
                    return false;
                }
            }), catchError(error => {
                this.storage.removeAuthToken();
                return of(false);
            }));
        }
        return of(false);
    }

    // Renew token if about to expire
    renewToken() {
        const options = this.request.getAuthOptions(true);
        this.http.post(environment.baseUrl + '/api/auth/renewtoken', '', options).pipe(map(resp => {
            if (resp) {
                this.currentUser = <IUser>resp.json();
                this.storage.setAuthToken(resp);
            }
        }), catchError(error => {
            if (error._body instanceof ProgressEvent) {
                return this.handleError(error);
            }
        }));
    }

    // check if user token has expired, check for renewal, and check roles. called by AuthGuard
    checkUserAuth(roles: string[]): Observable<Boolean> {
        const token = this.storage.getAuthToken();
        if (token === null) {
            this.router.navigate(['/login']);
            return of(false);
        }
        // Check if token has expired
        if (this.jwtHelper.isTokenExpired(token)) {
            this.logout(false);
            return of(false);
        }

        // Check if token needs to be renewed
        const expireDate = this.jwtHelper.getTokenExpirationDate(token);
        const checkDate = new Date(new Date().setMinutes(new Date().getUTCMinutes() + 30));
        if (expireDate < checkDate) {
            this.renewToken();
        }

        // Check roles provided vs roles in token
        let access: Boolean = false;
        const userRoles = this.jwtHelper.decodeToken(token).roles;
        if (roles && userRoles) {
            if (roles.length > 0 && userRoles.length > 0) {
                for (let i = 0; i < roles.length; i++) {
                    if (userRoles.indexOf(roles[i]) > -1) {
                        access = true;
                        break;
                    }
                }

                if (!access) {
                    this.router.navigate(['/error']);
                }
                return of(access);
            }
        }

        return of(true);
    }

    // validates roles for users
    isInRole(roles: string[]) {
        let access: Boolean = false;
        const token = this.storage.getAuthToken();
        if (token === null) {
            return false;
        }
        const checkUserRoles = [];
        const userRoles = this.jwtHelper.decodeToken(token).roles;
        if (roles.length > 0 && userRoles !== undefined) {
            if (Array.isArray(userRoles)) {
                userRoles.forEach(r => {
                    const role = r.replace(/-/g, '').toUpperCase();
                    checkUserRoles.push(role);
                });
            } else {
                const role = userRoles.replace(/-/g, '').toUpperCase();
                checkUserRoles.push(role);
            }
            if (roles.length > 0 && checkUserRoles.length > 0) {
                for (let i = 0; i < roles.length; i++) {
                    const role = roles[i].replace(/-/g, '').toUpperCase();
                    if (checkUserRoles.indexOf(role) > -1) {
                        access = true;
                        break;
                    }
                }
            }
        }

        return access;
    }


    // Log user out
    logout(publicLogout: boolean) {
        const options = this.request.getAuthOptions(true);
        this.currentUser = undefined;
        this.storage.removeAuthToken();
        if (publicLogout) {
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/login']);
        }
        this.displayName = '';
        this.updateUserName('');
        return this.http.post(environment.baseUrl + '/api/auth/logout', JSON.stringify({}), options);
    }

    // Handle errors
    private handleError(error: Response) {
        return throwError(error.statusText);
    }

    getUserRegister(registrationId: string) {
        const options = this.request.getAuthOptions(false);
        return this.http.get(environment.baseUrl +
            '/api/auth/userregister?id=' + registrationId, options).pipe(map((response: Response) => {
            return <IRegister>response.json();
        }), catchError(error => {
            if (error._body instanceof ProgressEvent) {
                return throwError('Error connecting to server');
            }
            return throwError(error._body);
        }));
    }

    postUserRegister(registration: IRegister) {
        const options = this.request.getAuthOptions(false);

        return this.http.post(environment.baseUrl + '/api/auth/userregister', registration, options).pipe(map((response: Response) => {
            return response;
        }), catchError(error => {
          return throwError(error);
        }));
    }

}
