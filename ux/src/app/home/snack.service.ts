import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackService {


    private errorSnackRef: any
    // private schedulinDialogRef:  any
    // private schedulerDialogRef:  any

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
        this.errorSnackRef = this._snackBar.open(message, action, {
            duration: 2000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "warning-snackbar"
        })
    }

    public closeSnackLogin() {
        this.errorSnackRef.close()
    }
}
