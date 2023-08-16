
import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, CalendarWeekViewBeforeRenderEvent, DateAdapter } from 'angular-calendar';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import * as moment from 'moment';
import { SnackService } from '../snack.service';
import { getEventsInPeriod } from 'calendar-utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { startOfDay, endOfDay } from 'date-fns';
import { HostListener } from '@angular/core'


@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

    calendarView = CalendarView;
    viewMode: CalendarView = window.innerWidth <= 768 ? CalendarView.Day : CalendarView.Week 
    viewDate: Date = new Date();
    events: CalendarEvent[] = []
    tomorrowEvents: CalendarEvent[] = []
    checkDoubleEvents: CalendarEvent[] = []
    viewButton = this.viewMode
    refresh = true
    totalEventsToday = 0
    hideButton = false
    isAdmin = true

    private currentMonth: Date = new Date()

    constructor(
        private snack: SnackService,
        private dialogService: DialogService,
        public homeService: HomeService,
        public auth: AuthService,
        private dateAdapter: DateAdapter
    ) {}

    ngOnInit() {
        if (!this.auth.authenticated) {
            this.auth.logout()
            return
        }
        this.resize()
        this.auth.checkToken()
        this.homeService._refreshNeeded$
            .subscribe(() =>{
                this.refresh = true
                this.checkCurrentMonth()
            })
        this.checkCurrentMonth()
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.resize()
    }

    resize() {
        this.hideButton = window.innerWidth <= 768 ? true : false
        this.viewMode = window.innerWidth <= 768 ? CalendarView.Day : CalendarView.Week
    }

    public checkCurrentMonth() {
        const sunday = moment(this.viewDate).startOf("week").toDate()
        const saturday = moment(this.viewDate).endOf("week").toDate()
    
        const areSameMonth = moment(sunday).isSame(moment(saturday), "month")
    
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
            if (sameMonth && !this.refresh) {
                return
            }
            const year = moment(this.viewDate).year()
            const month = moment(this.viewDate).format("MM")
            this.getEvents(year, month)
        }
        this.currentMonth = this.viewDate
        this.refresh = false
    }


    private getEvents(firstYear: number, firstMonth: string, secondYear?: number, secondMonth?: string) {
        if (this.auth.isAdmin) {
            this.getAllTomorrowEvents()
            if (arguments.length <= 2 || typeof secondYear === "undefined" || typeof secondMonth === "undefined") {
                this.getAllEvents()
            } else {
                this.getAllEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth)
            }
        } else {
            if (arguments.length <= 2 || typeof secondYear === "undefined" || typeof secondMonth === "undefined") {
                this.getMyEvents()
            } else {
                this.getMyEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth)
            }
        }
    }

    private getAllEvents() {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")

        this.homeService.getAllEvents(ano, mes)
            .subscribe( {
                next: (events: Array<CalendarEvent>) => {
                    this.events = events
                },
                error: () => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                }
            })
    }

    private getAllEventsDoubleMonth(firstYear: number, firstMonth: string, secondYear: number, secondMonth: string) {
        forkJoin([
            this.homeService.getAllEvents(firstYear, firstMonth),
            this.homeService.getAllEvents(secondYear, secondMonth)
        ]).subscribe({
            next: res => {
                this.events = this.mergeEvents(res[0], res[1])
            },
            error: () => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
            }
        })
    }

    private getAllTomorrowEvents() {
        const ano = this.viewDate.getFullYear()
        const mes = (this.viewDate.getMonth() + 1).toString().padStart(2, "0")
        const dia = moment().add(1, 'day').format('DD');

        this.homeService.getAllEventsByDay(ano, mes, dia)
            .subscribe( {
                next: (events: Array<CalendarEvent>) => {
                    this.tomorrowEvents = events
                },
                error: () => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                }
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
                    error: () => {
                        this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                    }
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
            error: () => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
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

    addHeaderDays(event: CalendarWeekViewBeforeRenderEvent) {
        event.header = event.header.map((column: any) => {
          column['events'] = getEventsInPeriod(this.dateAdapter, {
            events: this.events,
            periodStart: startOfDay(column.date),
            periodEnd: endOfDay(column.date)
          })
          return column;
        })
    }

    public onCreateEvent() {
        this.checkCurrentMonth()
        this.dialogService.openSchedulerDialog(this.viewDate)
    }

    public onCheckList() {
        this.checkCurrentMonth()
        this.dialogService.openCheckListDialog(this.tomorrowEvents)
    }
}   