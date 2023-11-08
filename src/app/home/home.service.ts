import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Subject, take, tap, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Property } from "../../interfaces/property"
import * as moment from 'moment-timezone';
import { environment } from '../../environments/environment';
import { CompleteEventData } from 'src/interfaces/complete-event-data';
import { EventData } from 'src/interfaces/event';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    public _refreshNeeded$: Subject<object> = new Subject()
    
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
    }
    
    get refreshNeeded$() {
        return this._refreshNeeded$
    }

    private getUserOffSet() {
        const userTimeZone = moment.tz.guess();
        const offset = moment.tz(userTimeZone).utcOffset()
        return offset / 60
    }

    public convertUniversalDate(day: string, hour: string) {
        const offset = this.getUserOffSet();
        const convertedDay = moment.tz(`${day} ${hour}`, 'YYYY-MM-DD HH:mm', moment.tz.guess());
        const adjustedDay = convertedDay.utcOffset(offset, true);
        return adjustedDay.toDate();
    }

    // public convertUniversalDate(day: string, hour: string) {
    //     const offset = this.getUserOffSet()
        
    //     const convertedDay = new Date(day)
    //     if (offset < 0) {
    //         convertedDay.setHours(convertedDay.getHours() + (offset * -1))
    //     } else {
    //         convertedDay.setHours(convertedDay.getHours() - offset)
    //     }
    //     const convertedHour = hour.split(":") 
    
    //     convertedDay.setHours(parseInt(convertedHour[0]), parseInt(convertedHour[1]))
    //     return convertedDay
    // }

    public getAllEvents(year: number, month: string) {
        return this.http.get<Array<CompleteEventData>>(`${environment.API}/agendamentos/${year}-${month}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: CompleteEventData[]) => {
                if (events) {
                    return events.map((event: CompleteEventData) => {
                        let icon = ""
                        if (event.obs) {
                            icon = "&#x26A0;&#xFE0F;"
                        }
                        if (event.proprietarioid == 1 || event.proprietarioid == 2 || event.proprietarioid == 5) {
                            console.log(event)
                        }
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
                            start: this.convertUniversalDate(event.diaAgendamento, event.checkout),
                            color: this.colorateAll(event.proprietarioid),
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
        return this.http.get<Array<CompleteEventData>>(`${environment.API}/agendamentos/usuario/${year}-${month}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: CompleteEventData[]) => {
                if (events) {
                    return events.map((event: CompleteEventData) => {
                        let icon = ""
                        if (event.obs) {
                            icon = "<mat-icon>add</mat-icon>"
                        }
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
                            start: this.convertUniversalDate(event.diaAgendamento, event.checkout),
                            color: this.myColorate(),
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

    public getAllEventsByDay(year: number, month: string, day: string) {
        return this.http.get<Array<CompleteEventData>>(`${environment.API}/agendamentos/${year}-${month}-${day}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: CompleteEventData[]) => {
                if (events) {
                    return events.map((event: CompleteEventData) => {
                        let icon = ""
                        if (event.obs) {
                            icon = "&#x26A0;&#xFE0F;"
                        }
                        if (event.proprietarioid == 1 || event.proprietarioid == 2 || event.proprietarioid == 5) {
                            console.log(event)
                        }
                        return {
                            title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
                            start: this.convertUniversalDate(event.diaAgendamento, event.checkout),
                            color: this.colorateAll(event.proprietarioid),
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

    // public getMyEventsByDay(year: number, month: string, day: string) {
    //     return this.http.get<Array<CompleteEventData>>(`${environment.API}/agendamentos/usuario/${year}-${month}-${day}`, {
    //         headers: this.authService.defaultHeaders
    //     }).pipe(
    //         map((events: CompleteEventData[]) => {
    //             if (events) {
    //                 return events.map((event: CompleteEventData) => {
    //                     let icon = ""
    //                     if (event.obs) {
    //                         icon = "<mat-icon>add</mat-icon>"
    //                     }
    //                     return {
    //                         title: `${event.logadouro} ${event.numero} ${event.complemento || ""} ${icon}`,
    //                         start: this.convertUniversalDate(event.diaAgendamento, event.checkout),
    //                         color: this.myColorate(),
    //                         meta: event
    //                     }
    //                 })
    //             }
    //             return []
    //         }),
    //         catchError(error => {
    //             return throwError(() => error)
    //         })
    //     )
    // }

    public getAllProperties() {
        return this.http.get<Array<Property>>(`${environment.API}/todas_propriedades`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: Property[]) => {
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
        return this.http.get<Array<Property>>(`${environment.API}/minhas_propriedades`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            map((events: Property[]) => {
                if (events) {
                    console.log(events)
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
    

    public createEvent(propriedadeId: number, payload: EventData) {
        return this.http.post(`${environment.API}/agendamentos/propriedades/${propriedadeId}`, payload, {
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
        return this.http.delete(`${environment.API}/agendamentos/${agendamentoId}`, {
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

    public editEvent(agendamentoId: number, payload: EventData) {
        return this.http.patch(`${environment.API}/agendamentos/${agendamentoId}`, payload,{
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

    public getAllClients() {
        return this.http.get(`${environment.API}/usuarios/buscar_clientes`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            catchError(error => {
                return throwError(() => error)
            })
        )
    }

    public getClientValues(userId: number, date: string) {
        return this.http.get(`${environment.API}/agendamentos/valores/${userId}/${date}`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            catchError(error => {
                return throwError(() => error)
            })
        )
    }
    
    public getClientData() {
        return this.http.get(`${environment.API}/usuario`, {
            headers: this.authService.defaultHeaders
        }).pipe(
            catchError(error => {
                return throwError(() => error)
            })
        )
    }

    private colorateAll(clientId: number) {
        switch (clientId) {
            case 3:
                return {
                    primary: "#C5D9AB",
                    secondary: "#C5D9AB",
                    secondaryText: "#000000"
                }
            case 4:
                return {
                    primary: "#FFCC9C",
                    secondary: "#FFCC9C",
                    secondaryText: "#000000"
                }
            case 6:
                return {
                    primary: "#B199BF",
                    secondary: "#B199BF",
                    secondaryText: "#000000"
                };
            case 7:
                return {
                    primary: "#E6AFC3",
                    secondary: "#E6AFC3",
                    secondaryText: "#000000"
                }
            case 8:
                return {
                    primary: "#ACD3E8",
                    secondary: "#ACD3E8",
                    secondaryText: "#000000"
                }
            case 9:
            case 10:
            case 11:
            case 12:
            case 19:
                return {
                    primary: "#7B86B3",
                    secondary: "#7B86B3",
                    secondaryText: "#000000"
                }
            default:
                return {
                    primary: "#D1D1D1",
                    secondary: "#D1D1D1", 
                    secondaryText: "#000000"
                }
        }
    }

    private myColorate() {
        return {
            primary: "#ACD3E8",
            secondary: "#ACD3E8",
            secondaryText: "#000000"
        }
    }
}   

// primary: string;
// secondary: string;   
// secondaryText?: string;

//event.checkout == 11:00:00
//dia.agendamento == 2023-04-28T00:00:00Z