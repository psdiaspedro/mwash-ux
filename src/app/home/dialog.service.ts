import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { EditorComponent } from './editor/editor.component';
import { ReportComponent } from './report/report.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { ValuesReportComponent } from './values-report/values-report.component';
import { CompleteEventData } from 'src/interfaces/complete-event-data';
import { ReportClientData } from 'src/interfaces/client-report';
import { CalendarEvent } from 'angular-calendar';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistPickerComponent } from './checklist-picker/checklist-picker.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    
    private editorDialogRef?: MatDialogRef<EditorComponent>
    private schedulinDialogRef?:  MatDialogRef<SchedulingComponent>
    private schedulerDialogRef?:  MatDialogRef<SchedulerComponent>
    private confirmationDialogRef?:  MatDialogRef<ConfirmationComponent>
    private reportDialogRef?:  MatDialogRef<ReportComponent>
    private valuesDialogRef?: MatDialogRef<ValuesReportComponent>
    private checklistDialogRef?: MatDialogRef<ChecklistComponent>
    private checklistPickerDialogRef?: MatDialogRef<ChecklistPickerComponent>


    constructor(
        private dialog: MatDialog,
    ) {}

    public openSchedulingDialog(data?: CompleteEventData) {
        this.schedulinDialogRef = this.dialog.open(SchedulingComponent, { data })
    }

    public openEditorDialog(data?: CompleteEventData) {
        this.editorDialogRef = this.dialog.open(EditorComponent, { data })        
    }

    public openSchedulerDialog(data?: Date) {
        this.schedulerDialogRef = this.dialog.open(SchedulerComponent, { data })
    }

    public openConfirmationDialog(data?: CompleteEventData) {
        this.confirmationDialogRef = this.dialog.open(ConfirmationComponent, { data })
    }

    public openReportDialog() {
        this.reportDialogRef = this.dialog.open(ReportComponent)
    }

    public openValuesDialog(data?: ReportClientData[]) {
        this.valuesDialogRef = this.dialog.open(ValuesReportComponent, { data })
        this.valuesDialogRef.updateSize('800px', '')
    }

    public openCheckListDialog(data?: CalendarEvent[]) {
        this.checklistDialogRef = this.dialog.open(ChecklistComponent, { data })
        this.checklistDialogRef.updateSize('500px', '')
    }

    public openCheckListPickerDialog(data?: CalendarEvent[]) {
        this.checklistPickerDialogRef = this.dialog.open(ChecklistPickerComponent, { data })
    }

    public closeSchedulingDialog() {
        this.schedulinDialogRef?.close()
    }
    
    public closeEditorDialog() {
        this.editorDialogRef?.close()
    }

    public closeSchedulerDialog() {
        this.schedulerDialogRef?.close()
    }

    public closeConfirmationDialog() {
        this.confirmationDialogRef?.close()
    }

    public closeReportDialog() {
        this.reportDialogRef?.close()
    }

    public closeValuesDialog() {
        this.valuesDialogRef?.close()
    }

    public closeChecklistDialog() {
        this.checklistDialogRef?.close()
    }

    public closeChecklistPickerDialog() {
        this.checklistPickerDialogRef?.close()
    }

}
