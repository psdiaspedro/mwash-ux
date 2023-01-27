
import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { first, forkJoin, last, Observable, take } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import * as moment from 'moment';


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
    snack: any;

    private currentMonth: Date = new Date()

    constructor(
        private dialogService: DialogService,
        public homeService: HomeService,
        public auth: AuthService
    ) {}

    ngOnInit() {
        if (!this.auth.authenticated) {
            this.auth.logout()
            return
        }
        this.auth.checkToken()
        this.homeService._refreshNeeded$ //isso só acontece quando da um refresh
            .subscribe(() =>{
                this.checkCurrentMonth()
            })
        this.checkCurrentMonth()
    }

    public checkCurrentMonth() {
        const sunday = moment(this.viewDate).startOf("week").toDate() //first DOTW
        const saturday = moment(this.viewDate).endOf("week").toDate() //last DOTW
    
        const areSameMonth = moment(sunday).isSame(moment(saturday), "month") //se na mesma semana tem 2 meses diferentes
    
        if (this.viewMode == CalendarView.Week) {
            const year = moment(sunday).year()
            const month = moment(sunday).format("MM")

            if (areSameMonth) {
                this.getEvents(year, month)
            } else {
                const secondYear = moment(saturday).year()
                const secondMonth = moment(saturday).format("MM")
                this.getEvents(year, month, secondYear, secondMonth)
            }
        } else {
            const sameMonth = moment(this.viewDate).isSame(moment(this.currentMonth), "month")
            if (sameMonth) {
                return
            }
            const year = moment(this.viewDate).year()
            const month = moment(this.viewDate).format("MM")
            this.getEvents(year, month)
        }
        this.currentMonth = this.viewDate
    }

    private getEvents(firstYear: number, firstMonth: string, secondYear?: number, secondMonth?: string) {
        if (this.auth.isAdmin) {
            if (arguments.length <= 2 || typeof secondYear === "undefined" || typeof secondMonth === "undefined") {
                this.getAllEvents(firstYear, firstMonth)
            } else {
                this.getAllEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth)
            }
        } else {
            if (arguments.length <= 2 || typeof secondYear === "undefined" || typeof secondMonth === "undefined") {
                this.getMyEvents(firstYear, firstMonth)
            } else {
                this.getMyEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth)
            }
        }
    }

    private getAllEvents(year: number, month: string) {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")

        this.homeService.getAllEvents(ano, mes)
            .subscribe( {
                next: (events: Array<CalendarEvent>) => {
                    this.events = events
                },
                error: (error => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                })
            })
    }

    private getAllEventsDoubleMonth(firstYear: number, firstMonth: string, secondYear: number, secondMonth: string) {
        forkJoin([
            this.homeService.getAllEvents(firstYear, firstMonth),
            this.homeService.getAllEvents(secondYear, secondMonth)
        ]).subscribe({
            next: res => {
                this.events = this.mergeEvents(res[0], res[1])
                console.log(this.events)
            },
            error: error => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
            }
        })
    }

    private getMyEvents(year: number, month: string) {
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

    private getMyEventsDoubleMonth(firstYear: number, firstMonth: string, secondYear: number, secondMonth: string) {
        forkJoin([
            this.homeService.getMyEvents(firstYear, firstMonth),
            this.homeService.getMyEvents(secondYear, secondMonth)
        ]).subscribe({
            next: res => {
                this.events = this.mergeEvents(res[0], res[1])
                console.log(this.events)
            },
            error: error => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
            }
        })
    }

    private mergeEvents(firstEvents: Array<CalendarEvent>, secondEvents: CalendarEvent[]): CalendarEvent[] {
        return [...firstEvents, ...secondEvents]
    }

    public setView(viewMode: CalendarView) {
        this.viewMode = viewMode
    }

    public openSchedule(event: CalendarEvent) {
        this.dialogService.openSchedulingDialog(event.meta)
    }

    public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): 
    void {
        this.viewDate = date
        this.viewMode = CalendarView.Day
        this.viewButton = this.viewMode
    }
}   
