import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, throwError } from 'rxjs'; import { map, catchError } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthService, IRegister } from 'library';
import { accountModuleAnimation } from '../../shared/animation/routerTransition';
import { matchingPasswords } from '../../library/auth/validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [accountModuleAnimation()]
})

export class RegisterComponent implements OnInit {

  mainLoad: Boolean = true;
  loading: Boolean = false;
  errorCheck: Boolean = false;
  errorMessage = '';
  errorMain: Boolean = false;
  errorMessageMain = '';
  dataLoaded: Boolean = false;
  registration: IRegister;

  success: Boolean = false;

  registerForm: FormGroup;
  registrationId: string;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
        validator: matchingPasswords('Password', 'ConfPassword'),
      });
  }

  ngOnInit() {
    this.registrationId = this.route.snapshot.params['registrationId'];
    this.authService.getUserRegister(this.registrationId).subscribe(
        registration => {
            this.registration = registration;
            this.errorCheck = false;
            this.mainLoad = false;
        },
        error => {
            this.errorMessageMain = <any>error;
            this.errorMain = true;
            this.mainLoad = false;
        }
    );
  }

  registerUser() {
    this.loading = true;
    this.errorCheck = false;
    this.errorMessage = '';
    this.cdr.detectChanges();

    const newRegister: IRegister = {
      firstName: this.registerForm.value.FirstName,
      lastName: this.registerForm.value.LastName,
      email: this.registerForm.value.Email,
      password: this.registerForm.value.Password,
      id: this.registration.id,
      registrationId: this.registration.registrationId
    };

    this.authService.postUserRegister(newRegister)
      .subscribe(
      result => {
        this.success = true;
        this.loading = false;
      },
      error => {
        this.errorMessage = <any>error._body;
        this.errorCheck = true;
        this.loading = false;
      });
  }

  cancel() {
    this.router.navigate(['login']);
  }

}
