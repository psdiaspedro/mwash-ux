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
    snack: any;

    constructor(
        private dialogService: DialogService,
        public homeService: HomeService,
        public auth: AuthService
    ) {

    }

    ngOnInit() {
        if (!this.auth.authenticated) {
            this.auth.logout()
            return
        }
        this.auth.checkToken()
        this.homeService._refreshNeeded$ //isso só acontece quando da um refresh
            .subscribe(() =>{
                if(this.auth.isAdmin) {
                    this.getAllEvents(),
                    take(1)
                } else {
                    this.getMyEvents(),
                    take(1)
                }
            })
        if(this.auth.isAdmin) {
            this.getAllEvents()
        } else {
            this.getMyEvents()
        }
    }

    private getAllEvents() {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")

        //if(this.monthData.includes(this.viewDate.getMonth() + 1)) return 

        this.homeService.getAllEvents(ano, mes) //tratar erro
            .subscribe( {
                next: (events: Array<CalendarEvent>) => {
                    this.events = events
                },
                error: (error => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                })
            })
            
    }

    private getMyEvents() {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")

        this.homeService.getMyEvents(ano, mes)
            .subscribe( {
                    next: (events: Array<CalendarEvent>) => {
                        this.events = events
                    },
                    error: (error => {
                        this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                    })
            })
    }

    public setView(viewMode: CalendarView) {
        this.viewMode = viewMode
    }

    public openSchedule(event: CalendarEvent) {
        this.dialogService.openSchedulingDialog(event.meta)
    }

    public checkCurrentMonth() {
        if (this.startDate.getMonth() == this.viewDate.getMonth()) {
            return   
        }

        if(this.auth.isAdmin) {
            this.getAllEvents()
        } else {
            this.getMyEvents()
        }

        this.startDate = this.viewDate
    }

    public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): 
    void {
        this.viewDate = date
        this.viewMode = CalendarView.Day
        this.viewButton = this.viewMode
    }
}
