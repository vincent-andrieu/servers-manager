import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AuthLoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AuthLoginComponent
    ],
    imports: [
        CommonModule,

        MatButtonModule,
        MatIconModule
    ]
})
export class AuthModule {}