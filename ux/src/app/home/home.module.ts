import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HomeComponent } from './home.component';

import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { SchedulingComponent } from './scheduling/scheduling.component';
export function momentAdapterFactory() {
    return adapterFactory(moment);
  };
  

@NgModule({
    declarations: [
        HomeComponent,
        CalendarComponent,
        ToolbarComponent,
        SchedulingComponent
    ],
    imports: [
        CommonModule,
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
        MaterialModule,
        FormsModule
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }
