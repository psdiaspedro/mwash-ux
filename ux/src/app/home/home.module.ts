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
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { SchedulerComponent } from './scheduler/scheduler.component';

export function momentAdapterFactory() {
    return adapterFactory(moment);
  };
  

@NgModule({
    declarations: [
        CalendarComponent,
        ToolbarComponent,
        SchedulingComponent,
        EditorComponent,
        SchedulerComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaterialTimepickerModule,
        MatDialogModule
    ],
    providers: [
        provideNgxMask()
    ],
    exports: [
        HomeComponent,
    ]
})
export class HomeModule { }
