import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorComponent } from './editor/editor.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulingComponent } from './scheduling/scheduling.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    
    private editorDialogRef: any
    private schedulinDialogRef:  any
    private schedulerDialogRef:  any

    constructor(
        private dialog: MatDialog,
    ) { }

    public openSchedulingDialog(data?: any) {
        this.schedulinDialogRef = this.dialog.open(SchedulingComponent, { data })
    }

    public openEditorDialog(data?: any) {
        this.editorDialogRef = this.dialog.open(EditorComponent, { data })        
    }

    public openSchedulerDialog(data?: any) {
        this.schedulerDialogRef = this.dialog.open(SchedulerComponent, { data })
    }

    public closeSchedulingDialog() {
        this.schedulinDialogRef.close()
    }
    
    public closeEditorDialog() {
        this.editorDialogRef.close()
    }

    public closeSchedulerDialog() {
        this.schedulerDialogRef.close()
    }
}
