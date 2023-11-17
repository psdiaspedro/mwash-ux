import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { Property } from "../../../interfaces/property"
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { SnackService } from '../snack.service';
import { EventData } from 'src/interfaces/event';
import { CalendarEvent } from 'angular-calendar';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompleteEventData } from 'src/interfaces/complete-event-data';


@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {

    public createEventForm = new FormGroup({
        diaAgendamento: new FormControl("", Validators.required),
        propriedadeID: new FormControl(null, Validators.required),
        checkout: new FormControl(null, Validators.required),
        checkin: new FormControl(""),
        obs: new FormControl(),
    })

    private property: Property = {
        id: 0,
        cidade: "",
        bairro: "",
        cep: "",
        logadouro: "",
        numero: "",
        enderecoCompleto: "",
    }

    private payload: EventData = {}
    private properties: Array<Property> = []
    public filteredOptions: Observable<Property[]> = new Observable()
    public allEvents: CompleteEventData[] = []
    public fullEvents: CalendarEvent[] = []
    public todayEvents: CalendarEvent[] = []
    locale: string = "";

    constructor(
        private snack: SnackService,
        public auth: AuthService,
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public viewDate: Date
    ) { }

    ngOnInit(): void {
        this.getFullEvents()
        if (this.auth.isAdmin) {
            this.getAllProperties()
        } else {
            this.getMyProperties()
        }
        this.filteredOptions = this.createEventForm.controls["propriedadeID"].valueChanges
            .pipe(
                startWith(""),
                map((value: any) => {
                    const address = typeof value == "string" ? value : value.enderecoCompleto
                    return address ? this._filter(address as string) : this.properties.slice()
                })
            )
    }

    private checkTimeLimit(): boolean {
        const diaAgendamento = this.createEventForm.value.diaAgendamento;
        const date = moment(diaAgendamento, "ddd MMM DD YYYY HH:mm:ss ZZ")
        const tomorrow = moment().add(1, 'days')
        const today = moment()
        const limit = moment().set({ hour: 17, minute: 0, second: 0 });

        if (date.isSame(tomorrow, 'day') && today.isAfter(limit)) {
            return true;
        }
        return false;
    }

    private checkPastDate(): boolean {
        const diaAgendamento = this.createEventForm.value.diaAgendamento;
        const date = moment(diaAgendamento, "ddd MMM DD YYYY HH:mm:ss ZZ");
        const today = moment();
    
        // Verifica se a data do agendamento é anterior a hoje ou hoje
        if (date.isBefore(today, 'day') || date.isSame(today, 'day')) {
            return true;
        }
        return false;
    }

    private _filter(value: string): Property[] {
        const filterValue = value.toLowerCase();
        return this.properties.filter(property => property.enderecoCompleto.toLowerCase().includes(filterValue));
    }

    public onCreate() {
        this.createEventForm.get("checkout")?.markAllAsTouched()
        this.createEventForm.get("propriedadeID")?.markAllAsTouched()
        this.formatTime()
        this.formatDate()
        if (!this.createEventForm.valid) {
            this.snack.openErrorSnack("Campos obrigatórios não preenchidos")
            return
        }
    
        if (!this.auth.isAdmin && this.checkTimeLimit()) {
            this.snack.openTimeErrorSnack("O horário limite de agendamentos para o dia seguinte é 17h00, para emergencias favor contatar a administração")
            return
        }

        // Verifica se é dia anterior ou hoje
        if (!this.auth.isAdmin && this.auth.userId != 6 && this.checkPastDate()) {
            this.snack.openTimeErrorSnack("Não é possível fazer um agendamento para a data selecionada")
            return
        }

        if (this.createEventForm.value.propriedadeID) {
            this.property = this.createEventForm.value.propriedadeID
            this.payload.propriedadeId = this.property.id
        }

        if (this.createEventForm.value.obs) {
            this.payload.obs = this.createEventForm.value.obs
        }

        this.getTodayEvents()
        // if (this.checkDoubleEvents()) {
        //     this.snack.openTimeErrorSnack("Ja existe um agendameto para a propriedade e data selecionadas")
        //     return
        // }
        //this.createEvent()
    }

    private formatTime() {
        if (this.createEventForm.value.checkin) {
            this.payload.checkin = this.createEventForm.value.checkin
        }
        if (this.createEventForm.value.checkout) {
            this.payload.checkout = this.createEventForm.value.checkout
        }
    }

    private formatDate() {
        if (this.createEventForm.value.diaAgendamento) {
            this.payload.diaAgendamento = moment(this.createEventForm.value.diaAgendamento).format("DD-MM-YYYY")
        }
    }

    private getMyProperties() {
        this.homeService.getMyProperties()
            .subscribe(
                (properties: Property[]) => {
                    this.properties = properties
                }
            )
    }

    private getAllProperties() {
        this.homeService.getAllProperties()
            .subscribe(
                (properties: Property[]) => {
                    this.properties = properties
                }
            )
    }

    public displayFn(property: Property): string {
        return property ? property.enderecoCompleto : ""
    }

    private createEvent() {
        this.homeService.createEvent(this.property.id, this.payload)
            .subscribe({
                next: () => {
                    this.dialogService.closeSchedulerDialog()
                    this.snack.openWarningSnack("Agendamento criado com sucesso")
                },
                error: (error) => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                }
            })
    }

    private fillAllEvents() {
        this.fullEvents.forEach((event) => {
            this.allEvents.push(event.meta)
        })
    }

    // private checkDoubleEvents() {
    //     for (const event of this.allEvents) {
    //         const formattedDate = moment(this.homeService.convertUniversalDate(event.diaAgendamento, event.checkout)).format("DD-MM-YYYY")
    //         if (formattedDate === this.payload.diaAgendamento && event.propriedadeId === this.payload.propriedadeId) {
    //             return true
    //         }
    //     }
    //     return false
    // }

    private getTodayEvents() {
        if (this.createEventForm.value.diaAgendamento) {
            const diaAgendamento: moment.Moment = moment(this.createEventForm.value.diaAgendamento, "DD-MM-YYYY");
        
            const dia: string = diaAgendamento.format("DD");
            const mes: string = diaAgendamento.format("MM");
            const ano: number = parseInt(diaAgendamento.format("YYYY"), 10);

            
            if(this.auth.isAdmin) {
                this.homeService.getAllEventsByDayAdmin(ano, mes, dia)
                    .subscribe( {
                        next: (events: Array<CalendarEvent>) => {
                            this.todayEvents = events
                            const propriedadeId = this.payload.propriedadeId;
                            
                            // Verifica se o evento já existe com o mesmo propriedadeId
                            const eventoExistente = this.todayEvents.find(event => event.meta.propriedadeId === propriedadeId);
                            console.log(eventoExistente)
                            
                            if (eventoExistente) {
                                this.snack.openTimeErrorSnack("Já existe um agendamento para a propriedade e data selecionadas");
                                return
                            }
                            this.createEvent()
                        },
                        error: () => {
                            this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                        }
                    })
            } else {
                this.homeService.getAllEventsByDay(ano, mes, dia)
                    .subscribe( {
                        next: (events: Array<CalendarEvent>) => {
                            this.todayEvents = events
                            const propriedadeId = this.payload.propriedadeId;
                            
                            // Verifica se o evento já existe com o mesmo propriedadeId
                            const eventoExistente = this.todayEvents.find(event => event.meta.propriedadeId === propriedadeId);
                            console.log(eventoExistente)
                            
                            if (eventoExistente) {
                                this.snack.openTimeErrorSnack("Já existe um agendamento para a propriedade e data selecionadas");
                                return
                            }
                            this.createEvent()
                        },
                        error: () => {
                            this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                        }
                    })
            }

            
        }
    }

    private getFullEvents() {
        const thisDate = moment(this.viewDate);
        const nextDate = thisDate.clone().add(1, "month");

        this.searchEvents(thisDate.year(), thisDate.format("MM"), nextDate.year(), nextDate.format("MM"));
    }

    private searchEvents(firstYear: number, firstMonth: string, secondYear: number, secondMonth: string) {
        if (this.auth.isAdmin) {
            this.getAllEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth);
        } else {
            this.getMyEventsDoubleMonth(firstYear, firstMonth, secondYear, secondMonth);
        }
    }

    private getAllEventsDoubleMonth(firstYear: number, firstMonth: string, secondYear: number, secondMonth: string) {
        forkJoin([
            this.homeService.getAllEvents(firstYear, firstMonth),
            this.homeService.getAllEvents(secondYear, secondMonth)
        ]).subscribe({
            next: res => {
                this.fullEvents = this.mergeEvents(res[0], res[1])
                this.fillAllEvents()
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
                this.fullEvents = this.mergeEvents(res[0], res[1])
                this.fillAllEvents()
            },
            error: () => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
            }
        })
    }

    private mergeEvents(firstEvents: Array<CalendarEvent>, secondEvents: CalendarEvent[]): CalendarEvent[] {
        return [...firstEvents, ...secondEvents]
    }
}
