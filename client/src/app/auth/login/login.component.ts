import { Component } from '@angular/core';

import { AuthService } from "@services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})
export class AuthLoginComponent {
    constructor(public authService: AuthService) {}
}