import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackService {

    constructor(
        private _snackBar: MatSnackBar
    ) { }

    public openErrorSnack(message: string, action?: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "error-snackbar"
        })
    }

    public openWarningSnack(message: string, action?: string) {
        this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "warning-snackbar"
        })
    }

    public openTimeErrorSnack(message: string, action?: string) {
        this._snackBar.open(message, action, {
            duration: 10000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "error-snackbar"
        })
    }
}
