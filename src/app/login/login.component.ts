import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { catchError, EMPTY, take, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { SnackService } from '../home/snack.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public loginForm = new FormGroup({
        email: new FormControl("", Validators.required),
        senha: new FormControl("", Validators.required)
    })

    private readonly API = "http://18.228.151.243:5000"

    constructor(
        private snack: SnackService,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        if (this.authService.authenticated) this.redirect()
    }

    public onLogin() {
        this.loginForm.get("email")?.markAllAsTouched()
        this.loginForm.get("senha")?.markAllAsTouched()

        if (!this.loginForm.valid) return

        this.login()
            .subscribe({
                next: (response: any) => {
                    this.createSession(response.id, response.nome, response.token)
                    this.redirect()
                },
                error: (error) => {
                    if (error.status === 0) {
                        this.snack.openErrorSnack("Não foi possível se conectar com a API")
                    }
                    if (error.status === 401) {
                        this.snack.openErrorSnack("Dados inválidos, tente novamente")
                    }
                }
            })
        // console.log(this.authService.decodeToken)
    }

    private login() {
        return this.http.post(`${this.API}/login`, this.loginForm.value, {
            headers: {
                "content-type": "application/json"
            }
        })
            .pipe(
                catchError(error => {
                    return throwError(() => error)
                }),
                take(1))
    }

    private createSession(userID: string, userName: string, accessToken: string) {
        localStorage.setItem("userID", userID)
        localStorage.setItem("userName", userName)
        localStorage.setItem("accessToken", accessToken)
    }

    private redirect() {
        this.router.navigateByUrl("/home")
    }

}
