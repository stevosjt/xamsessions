import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './resolvers/auth.resolver';
import { RequestService } from './services/request.service';
import { StorageService } from './services/storage.service';
import { AuthGuard } from './services/auth.guard';

export * from './services/auth.guard';
export * from './services/auth.service';
export * from './services/request.service';
export * from './services/storage.service';
export * from './validators/password.validator';
export * from './resolvers/auth.resolver';
export * from './models/password-change.model';
export * from './models/register.model';
export * from './models/user.model';


@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: []
})
export class AuthModule {}
