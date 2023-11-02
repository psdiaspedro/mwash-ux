import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { CompleteEventData } from 'src/interfaces/complete-event-data';
import { SnackService } from '../snack.service';
import { AuthService } from 'src/app/auth.service';


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
        private snack: SnackService,
        public auth: AuthService,
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

    private checkPastDate(data: CompleteEventData): boolean {
        const diaAgendamento = this.data.diaAgendamento;

        // Separar dia, mês e ano usando split
        const [day, month, year] = diaAgendamento.split('/');
        // Criar objeto Moment.js e formatar a data
        const formattedDate = moment(`${year}-${month}-${day} 00:00:00 GMT-0300`, 'YYYY-MM-DD HH:mm:ss ZZ');
        
        const date = moment(formattedDate, "ddd MMM DD YYYY HH:mm:ss ZZ");        
        const today = moment();

        // Verifica se a data do agendamento é anterior a hoje ou hoje
        if (date.isBefore(today, 'day') || date.isSame(today, 'day')) {
            return true;
        }
        return false;
    }

    public deleteEvent() {
        if (!this.auth.isAdmin && this.auth.userId != 6 && this.checkPastDate(this.data)) {
            this.snack.openTimeErrorSnack("Não é possível realizar alterações no agendamento selecionado")
            return;
        }
        this.dialogService.openConfirmationDialog(this.data)
    }

    public editEvent() {
        if (!this.auth.isAdmin && this.auth.userId != 6 && this.checkPastDate(this.data)) {
            this.snack.openTimeErrorSnack("Não é possível realizar alterações no agendamento selecionado")
            return;
        }
        
        this.dialogService.openEditorDialog(this.data)
    }
}
