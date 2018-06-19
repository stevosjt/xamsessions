import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import { AuthModule, LayoutModule, AuthService, StorageService, AuthGuard, RequestService, AuthResolver } from 'library';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { CoreModule } from './app/layout/core.module';
import { layoutConf } from './app/layout/layout.conf';
import { RegisterComponent } from './app/register/register.component';
import { LoginComponent } from './app/login/login.component';
import { HomeComponent } from './app/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(APP_ROUTES),
    CoreModule,
    LayoutModule.forRoot(layoutConf),
    LoadingPageModule, MaterialBarModule,
    AuthModule
  ],
  providers: [
    AuthService,
    StorageService,
    AuthGuard,
    RequestService,
    AuthResolver
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
