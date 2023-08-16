import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { SnackService } from '../snack.service';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';
import { CompleteEventData } from 'src/interfaces/complete-event-data';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { CalendarEvent } from 'angular-calendar';
import { ClipboardService } from 'ngx-clipboard';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit{

    constructor(
        public auth: AuthService,
        private snack: SnackService,
        public homeService: HomeService,
        public dialogService: DialogService,
        private ClipboardService: ClipboardService,
        private clipboard: Clipboard,
        @Inject(MAT_DIALOG_DATA) public data: CalendarEvent[]
    ) { }

    ngOnInit() {
        this.formatDate()
        this.groupByClient()
        this.buildStringCopy()
    }

    public groupedByClient: { [cliente: string]: { [checkout: string]: CalendarEvent[] } } = {};
    public tomorrow = ""
    public total = 0
    public text = "QUE LOUCURA"
    public contentToCopy:string = ""

    private groupByClient() {
        this.data.forEach((item) => {
            const client = item.meta && item.meta.nome;
            const checkout = item.meta.checkout;

            if (!this.groupedByClient[client]) {
                this.groupedByClient[client] = {};
            }

            if (!this.groupedByClient[client][checkout]) {
                this.groupedByClient[client][checkout] = [];
            }
            
            this.groupedByClient[client][checkout].push(item);
        })
    }

    private formatDate() {
        const date = moment().add(1, 'day').locale("pt-br")
        const month = date.format("MM")
        const day =  date.format('DD');
        const year = date.format("YY")
        const week = date.format("dddd")
        const formattedWeekday = week.charAt(0).toUpperCase() + week.slice(1);
        this.tomorrow = `${day}/${month} - ${formattedWeekday}`
    }

    formatedCheckout(checkout: string): string {
        return checkout.substr(0, 5); // Retorna os primeiros 5 caracteres (HH:mm)
    }

    hasCheckin(checkin: string): boolean {
        return checkin !== '00:00:00';
    }

    hasObs(obs: string): boolean {
        if (obs != undefined)
            return true
        return false
    }

    nonShowApto(complemento: string): string {
        return complemento.replace(/^apto\s*/i, '');
    }

    buildStringCopy() {
        let total = 0
        this.contentToCopy += `*Programação: ${this.tomorrow}*\n\n`
        for (const clienteKey in this.groupedByClient) {
            if (this.groupedByClient.hasOwnProperty(clienteKey)) {
                this.contentToCopy += `*${clienteKey}*\n`

                const checkouts = this.groupedByClient[clienteKey];
        
                for (const checkoutKey in checkouts) {
                    if (checkouts.hasOwnProperty(checkoutKey)) {
                        this.contentToCopy += `\t Out: ${this.formatedCheckout(checkoutKey)}\n`
                       
                        const eventos = checkouts[checkoutKey];
        
                        for (const evento of eventos) {
                            total += 1
                            this.contentToCopy += `\t\t ${total}. ${evento.meta.complemento}, ${evento.meta.bairro}`

                            if (this.hasCheckin(evento.meta.checkin))
                                this.contentToCopy += " (IN)"

                            if (evento.meta.obs) {
                                this.contentToCopy += ` - ${evento.meta.obs}`
                            }

                            this.contentToCopy += "\n"
                        }
                    }
                }
            }
        }
    }

    copyContent() {
        this.clipboard.copy(this.contentToCopy);
    }
}
