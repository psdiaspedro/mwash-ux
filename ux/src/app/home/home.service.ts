import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { map, Subject, take, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    private readonly API = "http://localhost:5000"
    public _refreshNeeded$: Subject<any> = new Subject()
    
    
    constructor(
        private http: HttpClient
    ) {

    }

    get refreshNeeded$() {
        return this._refreshNeeded$
    }

    //(events: CalendarEvent[] == RESPONSE)
    getAllEvents(ano: number, mes: string) {
        return this.http.get<CalendarEvent[]>(`${this.API}/agendamentos/${ano}-${mes}`)
            .pipe(
                map((event) => {
                    for(let i = 0; i < event.length; i++) {
                        event[i].start = new Date(event[i].start)
                    }
                    return event
                })
            )
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

    private handleError(error: HttpErrorResponse) {
        console.log(error)
    }
}
