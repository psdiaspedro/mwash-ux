import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgControlStatus, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { Agendamento } from './agendamento';
import { Property } from "../property"
import { map, Observable, startWith } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { SnackService } from '../snack.service';

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
        checkin: new FormControl(),
        obs: new FormControl(),
    })

    private payload: Agendamento = {}
    private property: Property = {
        id: 0,
        cidade: "",
        bairro: "",
        cep: "",
        logadouro: "",
        numero: "",
        enderecoCompleto: "",
    }

    public properties: Array<Property> = []
    public filteredOptions: Observable<any> = new Observable()


    constructor(
        private snack: SnackService,
        public auth: AuthService,
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }   

    ngOnInit(): void {
        if(this.auth.isAdmin) {
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

    private _filter(value: string): Property[] {
        const filterValue = value.toLowerCase();
        return this.properties.filter(property => property.enderecoCompleto.toLowerCase().includes(filterValue));
    }

    public onCreate() { 
        this.formatTime()
        this.formatDate()
        if(!this.createEventForm.valid) {
            this.snack.openErrorSnack("Campos obrigatórios não preenchidos")
            return
        } 

        if (this.createEventForm.value.propriedadeID) {
            this.property = this.createEventForm.value.propriedadeID
            this.payload.propriedadeId = this.property.id
        }
        
        if (this.createEventForm.value.obs) {
            this.payload.obs = this.createEventForm.value.obs
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
            (properties: any) => {
                this.properties = properties
            }
        )
    }

    private getAllProperties() {
        this.homeService.getAllProperties()
            .subscribe(
                (properties: any) => {

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
                next: (response) => {
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
}
