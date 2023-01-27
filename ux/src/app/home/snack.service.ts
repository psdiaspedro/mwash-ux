import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackService {


    private errorSnackRef: any
    private warningSnackRef:  any

    constructor(
        private _snackBar: MatSnackBar
    ) { }

    public openErrorSnack(message: string, action?: any) {
        this.errorSnackRef = this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "error-snackbar"
        })
    }

    public openWarningSnack(message: string, action?: any) {
        this.warningSnackRef = this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "warning-snackbar"
        })
    }

    public openTimeErrorSnack(message: string, action?: any) {
        this.errorSnackRef = this._snackBar.open(message, action, {
            duration: 10000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "error-snackbar"
        })
    }
}
