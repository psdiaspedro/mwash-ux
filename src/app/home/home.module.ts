import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HomeComponent } from './home.component';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulingComponent } from './scheduling/scheduling.component';
import { EditorComponent } from './editor/editor.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDialogModule } from '@angular/material/dialog';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportComponent } from './report/report.component';
import { ValuesReportComponent } from './values-report/values-report.component';
import { ChecklistComponent } from './checklist/checklist.component';
import {ClipboardModule} from "ngx-clipboard"
import { ChecklistPickerComponent } from './checklist-picker/checklist-picker.component';

export function momentAdapterFactory() {
    return adapterFactory(moment);
}

@NgModule({
    declarations: [
        CalendarComponent,
        ToolbarComponent,
        SchedulingComponent,
        EditorComponent,
        SchedulerComponent,
        ConfirmationComponent,
        ReportComponent,
        ValuesReportComponent,
        HomeComponent,
        ChecklistComponent,
        ChecklistPickerComponent
    ],
    imports: [
        CommonModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        MatDialogModule,
        HttpClientModule,
        NgbModalModule,
        ClipboardModule
    ],
    providers: [
        provideNgxMask()
    ],
    exports: [
        HomeComponent,
    ]
})
export class HomeModule { }
