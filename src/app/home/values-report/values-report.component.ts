import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';
import { AuthService } from 'src/app/auth.service';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ReportClientData } from 'src/interfaces/client-report';

@Component({
  selector: 'app-values-report',
  templateUrl: './values-report.component.html',
  styleUrls: ['./values-report.component.scss']
})
export class ValuesReportComponent implements OnInit {

    date = ""
    clientName = ""
    eventsDay: ReportClientData[] = []
    total = 0
    totalFirstQ = 0
    totalLastQ = 0
    
    constructor(
        public auth: AuthService,
        public homeService: HomeService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: ReportClientData
    ) {}

    ngOnInit(): void {
        this.formatDate()
        this.configInfos()
        this.formatInfos()
    }

    private formatDate() {
        const date = moment(this.data.diaAgendamento).locale("pt-br")
        const month = date.format("MMMM")
        const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1)
        const year = date.format("YYYY")
        this.date = `${capitalMonth}/${year}`
    }

    private configInfos() {
        this.data.forEach((element: ReportClientData) => {
            this.clientName = element.nome
            this.getQuarter(element.diaAgendamento,parseFloat(element.valor))
        });
    }

    private formatInfos() {
        this.eventsDay = this.data.map((event: ReportClientData) => {
            return {
                ...event,
                diaAgendamento: moment(event.diaAgendamento).add(3, "hours").format("DD/MM/YYYY")
            }
        })
    }
    
    private getQuarter(day: string, value: number) {
        const convertedDay = this.convertDate(day)
        if (convertedDay.getDate() <= 15) {
            this.totalFirstQ += value
        } else {
            this.totalLastQ += value
        }
        this.total += value
    }
    
    private convertDate(day: string) {
        const convertedDay = new Date(day)
        convertedDay.setHours(convertedDay.getHours() + 3)

        return convertedDay
    }

    public generatePDF() {
        const doc = new jsPDF();
        
        const img = "assets/img/logo.png"
        doc.addImage(img, "PNG", 80, 10, 50, 40)

        const tableHeaders = [['Dia Agendamento', 'Logadouro', 'Valor']];

        const tableData = this.eventsDay.map(event => {
            const value = event.valor.toString()
            const currencyValue = parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            return ([event.diaAgendamento, event.logadouro, currencyValue])
        })

        const total = Array(tableHeaders[0].length - 1).fill("")
        total.push("TOTAL: " + this.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        tableData.push(total)

        autoTable(doc, {
            head: tableHeaders,
            body: tableData,
            margin: {top: 70},
            didParseCell: function (data) {
                if (data.row.index === tableData.length - 1 && data.column.index === tableHeaders[0].length - 1) {
                  data.cell.styles.fontStyle = 'bold';
                }
            }
        });
        
        doc.save("relatório.pdf")
    } 
}
