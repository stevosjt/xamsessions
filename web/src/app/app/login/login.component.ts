import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '../../shared/animation/routerTransition';
import { AuthService } from 'library';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [accountModuleAnimation()]
})
export class LoginComponent implements OnInit {
  loginInvalid = false;
  mouseoverLogin = false;
  email: string;
  password: string;
  errorMessage: string;
  loading: Boolean = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

  }

  login(formValues) {
    this.loginInvalid = false;
    this.loading = true;
    this.errorMessage = '';
    this.auth.loginUser(formValues.email, formValues.password)
      .subscribe(
      (resp: any) => {
        this.router.navigate(['/']);
        this.auth.updateUserName(formValues.email);
      },
      error => {
        this.loginInvalid = true;
        this.errorMessage = <any>error;
        this.loading = false;
      });
  }
}
