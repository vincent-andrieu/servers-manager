import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthLoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AuthLoginComponent
    ],
    imports: [
        CommonModule
    ]
})
export class AuthModule {}