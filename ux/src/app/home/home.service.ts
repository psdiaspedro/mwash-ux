import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _AbstractConstructor } from '@angular/material/core';
import { CalendarEvent } from 'angular-calendar';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { catchError, EMPTY, map, Subject, take, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Event } from "./events"
import { Property } from "./property"

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
    
    private convertDate(day: string, hour: string) {
        let convertedDay = new Date(day)
        let convertedHour = hour.split(":")
        
        convertedDay.setHours(parseInt(convertedHour[0]), parseInt(convertedHour[1]))
        
        return convertedDay
    }

    public getAllEvents(year: number, month: string) {
        return this.http.get<Array<Event>>(`${this.API}/agendamentos/${year}-${month}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: any) => {
                if (events) {
                    return events.map((event: Event) => {
                        let icon = ""
                        if (event.obs) {
                            icon = "&#x26A0;&#xFE0F;"
                        }
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
                            start: this.convertDate(event.diaAgendamento, event.checkout),
                            end: event.checkin == "00:00:00" ? null : this.convertDate(event.diaAgendamento, event.checkin),
                            color: this.getColor(event.color),
                            meta: event
                        }
                    })
                }
                return []
            }),
            catchError(error => {
                return throwError(() => error)
            })
        )
    }

    public getMyEvents(year: number, month: string) {
        return this.http.get<Array<Event>>(`${this.API}/agendamentos/usuario/${year}-${month}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: any) => {
                if (events) {
                    return events.map((event: Event) => {
                        let icon = ""
                        if (event.obs) {
                            icon = "<mat-icon>add</mat-icon>"
                        }
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
                            start: this.convertDate(event.diaAgendamento, event.checkout),
                            end: event.checkin == "00:00:00" ? null : this.convertDate(event.diaAgendamento, event.checkin),
                            meta: event
                        }
                    })
                }
                return []
            }),
            catchError(error => {
                return throwError(() => error)
            })
        )
    }

    public getAllProperties() {
        return this.http.get<Array<Property>>(`${this.API}/todas_propriedades`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: any) => {
                if (events) {
                    return events.map((event: Property) => {
                        event["enderecoCompleto"] = `${event.logadouro} ${event.numero} ${event.complemento ? ', ' + event.complemento: ''}`;
                        return event
                    })
                }
                return []
            }),
            catchError(error => {
                return throwError(() => error)
            })
        )
    }

    public getMyProperties() {
        return this.http.get<Array<Property>>(`${this.API}/minhas_propriedades`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: any) => {
                if (events) {
                    return events.map((event: Property) => {
                        event["enderecoCompleto"] = `${event.logadouro} ${event.numero} ${event.complemento ? ', ' + event.complemento: ''}`;
                        return event
                    })
                }
                return []
            }),
            catchError(error => {
                return throwError(() => error)
            })
        )
    }
    

    public createEvent(propriedadeId: number, payload: any) {
        return this.http.post(`${this.API}/agendamentos/propriedades/${propriedadeId}`, payload, {
            headers: this.authService.defaultHeaders
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            catchError(error => {
                return throwError(() => error)
            }),
            take(1)
        )
    }

    public deleteEvent(agendamentoId: number) {
        return this.http.delete(`${this.API}/agendamentos/${agendamentoId}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            catchError(error => {
                return throwError(() => error)
            }),
            take(1)
        )
    }

    public editEvent(agendamentoId: number, payload: any) {
        return this.http.patch(`${this.API}/agendamentos/${agendamentoId}`, payload,{
            headers: this.authService.defaultHeaders
        }).pipe(
            tap(_ => {
                this._refreshNeeded$.next(_)
            }),
            catchError(error => {
                return throwError(() => error)
            }),
            take(1)
        )
    }

    private getColor(color: any) {
        return {
            primary: "#0000fa", //borda
            secondary: "#00ff00", //background
            secondaryText: "#000000" //texto
        }
    }
}

// primary: string;
// secondary: string;   
// secondaryText?: string;