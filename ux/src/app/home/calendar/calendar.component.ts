import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { validateEvents } from 'angular-calendar/modules/common/util/util';
import { pipe, Subject, take } from 'rxjs';
import { HomeService } from '../home.service';
import { SchedulingComponent } from '../scheduling/scheduling.component';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    calendarView = CalendarView;
    
    viewMode: CalendarView = CalendarView.Week
    viewDate: Date = new Date();
    events: CalendarEvent[] = []
    viewButton = this.viewMode

    constructor(
        public homeService: HomeService,
        private dialog: MatDialog
    ) {

    }

    ngOnInit() {
        this.homeService._refreshNeeded$
            .subscribe(() =>{
                this.getAllEvents(),
                take(1)
            })
        this.getAllEvents()
    }

    onSubmit() {
        this.homeService.createEvent().subscribe(response => {
            console.log(response)
        })
    }

    private getAllEvents() {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")
        
        this.homeService.getAllEvents(ano, mes)
        .subscribe((events: CalendarEvent[]) => {
            this.events = events
        })
    }

    public setView(viewMode: CalendarView) {
        this.viewMode = viewMode
    }

    public openSchedule(event: CalendarEvent) {
        this.dialog.open(SchedulingComponent, {data: event})
        console.log(event)
    }
}
