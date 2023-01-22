import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _AbstractConstructor } from '@angular/material/core';
import { CalendarEvent } from 'angular-calendar';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { map, Subject, take, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { Event } from "./events"

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    private readonly API = "http://localhost:5000"
    public _refreshNeeded$: Subject<any> = new Subject()
    
    
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {

    }

    get refreshNeeded$() {
        return this._refreshNeeded$
    }

    //tratar erros
    getAllEvents(ano: number, mes: string) {
        return this.http.get<Array<Event>>(`${this.API}/agendamentos/${ano}-${mes}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: any) => {
                if (events) {
                    return events.map((event: Event) => {
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""}`,
                            start: this.convertDate(event.diaAgendamento, event.checkout),
                            end: event.checkin == "00:00:00" ? null : this.convertDate(event.diaAgendamento, event.checkin),
                            meta: event
                        }
                    })
                }
                return []
            })
        )
    }
    
    private convertDate(day: string, hour: string) {
        let convertedDay = new Date(day)
        let convertedHour = hour.split(":")
        
        convertedDay.setHours(parseInt(convertedHour[0]), parseInt(convertedHour[1]))
        
        return convertedDay
    }

    // getClientEvents(ano: number, mes: string) {
    //     pegar accessToken e enviar pelo header do GET
    //     return this.http.get<CalendarEvent[]>(`${this.API}/agendamentos/${ano}-${mes}`)
    //         .pipe(
    //             map((event) => {
    //                 for(let i = 0; i < event.length; i++) {
    //                     event[i].start = new Date(event[i].start)
    //                 }
    //                 return event
    //             })
    //         )
    // }

    createEvent() {
        return this.http.post(this.API, {
            "start": "2023-01-15T14:15:30.000Z",
            "title": "Evento teste",
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            take(1)
        )
    }

    deleteEvent(agendamentoId: number) {
        return this.http.delete(`${this.API}/agendamentos/${agendamentoId}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            take(1)
        )
    }

    editEvent(agendamentoId: number, payload: any) {
        return this.http.patch(`${this.API}/agendamentos/${agendamentoId}`, payload,{
            headers: this.authService.defaultHeaders
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            take(1)
        )
    }
}
