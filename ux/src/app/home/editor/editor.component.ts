import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agendamento } from "./agendamento"
import * as moment from 'moment';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';
import { SnackService } from '../snack.service';
import { map, Observable, startWith } from 'rxjs';
import { Property } from "../property"
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
    
    public editorForm = new FormGroup({
        diaAgendamento: new FormControl(),
        propriedadeId: new FormControl(),
        checkout: new FormControl(),
        checkin: new FormControl(),
        obs: new FormControl(),
    })

    private payload: Agendamento = {}

    public properties: Array<Property> = []
    public filteredOptions: Observable<any> = new Observable()
    
    constructor(
        public auth: AuthService,
        private snack: SnackService,
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    public getFormValue() {
        this.getPayload()
        if (this.checkTimeLimit()) {
            this.snack.openTimeErrorSnack("O horário limite de agendamentos para o dia seguinte é 17h00, para emergencias favor contatar a administração")
            return
        }
        if(!this.isEmpty(this.payload)) {
            this.editEvent()
        } else {
            this.snack.openWarningSnack("Campos vazios, nenhuma alteração foi feita")
        }
    }

    private getPayload() {
        this.toTimeFormat()
        this.getDate()
        if (this.editorForm.value.obs) {
            this.payload.obs = this.editorForm.value.obs
        }
        if (this.editorForm.value.propriedadeId) {
            this.payload.propriedadeId = this.editorForm.value.propriedadeId
        }
    }

    private toTimeFormat() {
        if (this.editorForm.value.checkin) {
            console.log(this.editorForm.value.checkin)
            this.payload.checkin = this.editorForm.value.checkin
        }
        if (this.editorForm.value.checkout) {
            console.log(this.editorForm.value.checkout)
            this.payload.checkout = this.editorForm.value.checkout
        }
    }

    private getDate() {
        if (this.editorForm.value.diaAgendamento) {
            this.payload.diaAgendamento = moment(this.editorForm.value.diaAgendamento).format("DD-MM-YYYY")
        }
    }

    private isEmpty(obj: object) {
        return Object.keys(obj).length === 0;
    }

    private editEvent() {
        this.homeService.editEvent(this.data.agendamentoId, this.payload)
            .subscribe({
                next: (response) => {
                    this.snack.openWarningSnack("Agendamento editado com sucesso")
                    this.dialogService.closeEditorDialog()
                    this.dialogService.closeSchedulingDialog()
                },
                error: (error) => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
                }
            })
    }

    private checkTimeLimit(): boolean {
        const diaAgendamento = this.editorForm.value.diaAgendamento;
        const date = moment(diaAgendamento, "ddd MMM DD YYYY HH:mm:ss ZZ")
        const tomorrow = moment().add(1, 'days')
        const today = moment()
        const limit = moment().set({ hour: 17, minute: 0, second: 0 });

        if (date.isSame(tomorrow, 'day') && today.isAfter(limit)) {
            return true;
        }
        return false;
    }
}
