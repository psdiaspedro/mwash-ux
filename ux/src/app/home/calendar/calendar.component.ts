import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { validateEvents } from 'angular-calendar/modules/common/util/util';
import { pipe, Subject, take } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DialogService } from '../dialog.service';
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
    startDate: Date = new Date();

    //monthData: Array<number> = []
    //sideEvents: CalendarEvent[] = []

    constructor(
        private dialogService: DialogService,
        public homeService: HomeService,
        private dialog: MatDialog,
        public auth: AuthService
    ) {

    }

    ngOnInit() {
        if (this.auth.authenticated) {
            this.auth.checkToken()
        }
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

        //if(this.monthData.includes(this.viewDate.getMonth() + 1)) return 

        this.homeService.getAllEvents(ano, mes) //tratar erro
        .subscribe((events: Array<CalendarEvent>) => {
            //this.sideEvents = this.events
            //this.events = []
            //this.events.push(...this.sideEvents)
            //this.events.push(...events)
            //this.monthData.push(this.viewDate.getMonth() + 1);
            this.events = events
        })
    }

    public setView(viewMode: CalendarView) {
        this.viewMode = viewMode
    }

    public openSchedule(event: CalendarEvent) {
        //this.dialog.open(SchedulingComponent, {data: event.meta})
        this.dialogService.openSchedulingDialog(event.meta)
    }

    public checkCurrentMonth() {
        if (this.startDate.getMonth() == this.viewDate.getMonth()) {
            return   
        }

        // if (this.startDate.getFullYear() == this.viewDate.getFullYear()) {
        //     console.log(this.viewDate.getMonth() + 1)
        // } else {
        //     console.log(this.viewDate.getFullYear())
        //     console.log(this.monthData)
        //     this.monthData = this.monthData.filter(month => month !== this.viewDate.getMonth() + 1)
        //     console.log(this.monthData)
        // }

        this.getAllEvents()
        this.startDate = this.viewDate
    }

    public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): 
    void {
        this.viewDate = date
        this.viewMode = CalendarView.Day
        this.viewButton = this.viewMode
    }
}
