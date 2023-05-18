import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { CompleteEventData } from 'src/interfaces/complete-event-data';


@Component({
    selector: 'app-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent implements OnInit {

    public fullAddress = ""
    public checkin = ""
    public checkout = ""

    constructor(
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: CompleteEventData
    ) { }

    ngOnInit(): void {
        const currentDate = this.data.diaAgendamento
        this.validateDateFormat(currentDate)
        this.fullAddress = `${this.data.logadouro} ${this.data.numero}, ${this.data.complemento || ""}, ${this.data.bairro}` //ver isso aqui

        if(this.data.checkin == "00:00:00") {
            this.checkin = "&#10060;"
        } else {
            this.checkin = "&#9989;"
        }
    }

    private validateDateFormat(currentDate: string) {
        if (!moment(currentDate, "DD/MM/YYYY", true).isValid()) {
            const validDate = moment(this.data.diaAgendamento).add(3, "hours")
            this.data.diaAgendamento = validDate.format("DD/MM/YYYY")
        }
    }

    public deleteEvent() {
        this.dialogService.openConfirmationDialog(this.data)
    }

    public editEvent() {
        this.dialogService.openEditorDialog(this.data)
    }
}
