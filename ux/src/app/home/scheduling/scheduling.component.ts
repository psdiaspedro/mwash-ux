import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { EditorComponent } from '../editor/editor.component';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit {

    public fullAddress: string = ""
    public checkin: string = ""
    public checkout: string = ""

    constructor(
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        const currentDate = this.data.diaAgendamento
        this.validateDateFormat(currentDate)
        this.fullAddress = `${this.data.logadouro} ${this.data.numero}, ${this.data.complemento || ""}, ${this.data.bairro}` //ver isso aqui

        if(this.data.checkin == "00:00:00") {
            this.checkin = "N/A"
        } else {
            this.checkin = this.data.checkin
        }
    }

    private validateDateFormat(currentDate: string) {
        if (!moment(currentDate, "DD/MM/YYYY", true).isValid()) {
            this.data.diaAgendamento = moment(this.data.diaAgendamento).format("DD/MM/YYYY") 
        }
    }

    public deleteEvent() {
        //adicionar pop de confimação
        this.homeService.deleteEvent(this.data.agendamentoId).subscribe({
            next: (response) => {
                this.dialogService.closeSchedulingDialog()
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    public editEvent() {
        this.dialogService.openEditorDialog(this.data)
    }
}

// .subscribe({
//     next: (v) => console.log(v),
//     error: (e) => console.error(e),
//     complete: () => console.info('complete') 
// })
