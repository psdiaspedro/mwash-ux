import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agendamento } from "./agendamento"
import * as moment from 'moment';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';

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
    
    constructor(
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    public getFormValue() {
        this.getPayload()
        if(!this.isEmpty(this.payload)) {
            this.editEvent()
        } else {
            console.log("não editou nada, não faz a call")
            //dar retorno pro usuário
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
            this.payload.checkin = `${this.editorForm.value.checkin.slice(0, 2)}:${this.editorForm.value.checkin.slice(2)}`
        }
        if (this.editorForm.value.checkout) {
            this.payload.checkout = `${this.editorForm.value.checkout.slice(0, 2)}:${this.editorForm.value.checkout.slice(2)}`
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
                    this.dialogService.closeEditorDialog()
                    this.dialogService.closeSchedulingDialog()
                },
                error: (error) => {
                    console.log(error)
                }
            })
    }
}
