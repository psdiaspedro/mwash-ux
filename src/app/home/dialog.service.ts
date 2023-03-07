import { Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { EditorComponent } from './editor/editor.component';
import { ReportComponent } from './report/report.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { ValuesReportComponent } from './values-report/values-report.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    
    private editorDialogRef: any
    private schedulinDialogRef:  any
    private schedulerDialogRef:  any
    private confirmationDialogRef:  any
    private reportDialogRef:  any
    private valuesDialogRef: any

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

    public openConfirmationDialog(data?: any) {
        this.confirmationDialogRef = this.dialog.open(ConfirmationComponent, { data })
    }

    public openReportDialog(data?: any) {
        this.reportDialogRef = this.dialog.open(ReportComponent, { data })
    }

    public openValuesDialog(data?: any) {
        this.valuesDialogRef = this.dialog.open(ValuesReportComponent, { data })
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

    public closeConfirmationDialog() {
        this.confirmationDialogRef.close()
    }

    public closeReportDialog() {
        this.reportDialogRef.close()
    }

    public closeValuesDialog() {
        this.valuesDialogRef.close()
    }
}