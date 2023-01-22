import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { Agendamento } from './agendamento';

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {

    public createEventForm = new FormGroup({
        diaAgendamento: new FormControl("", Validators.required),
        propriedadeID: new FormControl(null, Validators.required),
        checkout: new FormControl(null, Validators.required),
        checkin: new FormControl(),
        obs: new FormControl(),
    })

    private payload: Agendamento = {}

    constructor(
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    public createEvent() {
        this.toTimeFormat()
        this.getDate()
        if (this.createEventForm.value.propriedadeID) {
            this.payload.propriedadeId = this.createEventForm.value.propriedadeID
        }
        if (this.createEventForm.value.obs) {
            this.payload.obs = this.createEventForm.value.obs
        }
        if (this.isEmpty(this.payload)) {
            console.log("ta vazio, irmao")
            console.log(this.payload)
            return
        }
        if (!this.createEventForm.value.diaAgendamento || !this.createEventForm.value.checkout) {
            console.log("ta faltando info obrigatoria, irmao")
            console.log(this.payload)
            return
        }
        //chamar funcao de cadastro
        //primeiro ver sobre as propriedades
    }

    private toTimeFormat() {
        if (this.createEventForm.value.checkin) {
            this.payload.checkin = `${(this.createEventForm.value.checkin as string).slice(0, 2)}:${(this.createEventForm.value.checkin as string).slice(2)}`
        }
        if (this.createEventForm.value.checkout) {
            this.payload.checkout = `${(this.createEventForm.value.checkout as string).slice(0, 2)}:${(this.createEventForm.value.checkout as string).slice(2)}`
        }
    }

    private getDate() {
        if (this.createEventForm.value.diaAgendamento) {
            this.payload.diaAgendamento = moment(this.createEventForm.value.diaAgendamento).format("DD-MM-YYYY")
        }
    }

    private isEmpty(obj: object) {
        return Object.keys(obj).length === 0;
    }

}
