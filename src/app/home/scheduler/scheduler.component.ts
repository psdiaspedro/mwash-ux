import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { Property } from "../../../interfaces/property"
import { map, Observable, startWith } from 'rxjs';
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


    constructor(
        private snack: SnackService,
        public auth: AuthService,
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public events: CalendarEvent[]
    ) { }

    ngOnInit(): void {
        this.fillAllEvents()
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

        if (this.createEventForm.value.propriedadeID) {
            this.property = this.createEventForm.value.propriedadeID
            this.payload.propriedadeId = this.property.id
        }

        if (this.createEventForm.value.obs) {
            this.payload.obs = this.createEventForm.value.obs
        }
        if (this.checkDoubleEvents()) {
            this.snack.openTimeErrorSnack("Ja existe um agendameto para a propriedade e data selecionadas")
            return
        }
        this.createEvent()
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
                    console.log(error)
                    console.log(this.payload)
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                }
            })
    }

    private fillAllEvents() {
        this.events.forEach((event) => {
            this.allEvents.push(event.meta)
        })
    }

    private checkDoubleEvents() {
        for (const event of this.allEvents) {
            const formattedDate = moment(this.homeService.convertUniversalDate(event.diaAgendamento, event.checkout)).format("DD-MM-YYYY")
            if (formattedDate === this.payload.diaAgendamento && event.propriedadeId === this.payload.propriedadeId) {
                return true
            }
        }
        return false
    }
}
