import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {


    private readonly API = "https://d9nhnqvsmbdvg.cloudfront.net:5000"

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    
    get decodeToken() {
        const payload = this.accessToken?.split(".")[1] || ""
        if (!payload) return null
        const decodeToken = atob(payload)
        const userInfo = JSON.parse(decodeToken)
        return userInfo
    }

    get isAdmin() {
        return this.decodeToken?.admin ? true : false
    }

    get accessToken() {
        return localStorage.getItem("accessToken") || ""
    }

    
    get authenticated() {
        return this.accessToken ? true : false
    }
    
    get defaultHeaders() {
        return {
            "Authorization": `Barrer ${this.accessToken}`
        }
    }
    
    public logout() {
        localStorage.removeItem("userID")
        localStorage.removeItem("userName")
        localStorage.removeItem("accessToken")

        this.router.navigateByUrl("/login")
    }

    public checkToken() {
        this.getToken().subscribe({
            next: (response) => {
            },
            error: (error) => {
                //tratar erro de token expirado?
                console.log(error)
                this.logout()
            }
        })
    }

    private getToken() {
        return this.http.get(`${this.API}/usuario/auth`, {
            headers: this.defaultHeaders,
            observe: "response"
        }).pipe(
            catchError(error => {
                return throwError(() => {
                    return error
                })
            })
        )
    }
}
