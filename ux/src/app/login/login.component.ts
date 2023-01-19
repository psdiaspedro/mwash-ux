import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { take } from 'rxjs';

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

    private readonly API = "http://localhost:5000"

    constructor(
        private http: HttpClient
    ) { }

    ngOnInit(): void {

    }

    public onLogin() {
        this.loginForm.get("email")?.markAllAsTouched()
        this.loginForm.get("senha")?.markAllAsTouched()

        if (!this.loginForm.valid) return

        this.login()
            .subscribe(
                response => {
                    console.log(typeof response)
                }
            )
    }

    private login() {
        return this.http.post(`${this.API}/login`, this.loginForm.value, {
            headers: {
                "content-type": "application/json"
            }})
            .pipe(take(1))
    }
}
