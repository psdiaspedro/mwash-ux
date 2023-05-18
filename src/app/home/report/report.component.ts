import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Property } from '../../../interfaces/property';
import { default as _rollupMoment, Moment } from 'moment';
import { SnackService } from '../snack.service';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';
import { AuthService } from 'src/app/auth.service';
import { MY_FORMATS } from 'src/interfaces/my-formats';
import { ReportUserData } from 'src/interfaces/report-user';
import { ReportClientData } from 'src/interfaces/client-report';


const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnInit {
  
  public reportForm = new FormGroup({
    clientes: new FormControl('', Validators.required),
    diaAgendamento: new FormControl('', Validators.required),
    propriedadeID: new FormControl(null, Validators.required),
  });

  public clients: ReportUserData[] = [];
  private clientsValues: ReportClientData[] = [];
  private idClienteLogado = 0;
  public  date = new FormControl(moment());

  constructor(
    private snack: SnackService,
    public homeService: HomeService,
    public dialogService: DialogService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAdmin) {
      this.getAllClients()
    } else {
      this.getClientData()
    }
  }

  public displayFn(property: Property): string {
    return property ? property.enderecoCompleto : '';
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    if (ctrlValue) {
      ctrlValue.month(normalizedMonthAndYear.month());
      ctrlValue.year(normalizedMonthAndYear.year());
      this.date.setValue(ctrlValue);
    }
    datepicker.close();
  }

  public onGerarRelatorio() {
    if (this.auth.isAdmin) {
      const nome = this.reportForm.controls['clientes'].value;
      const user = this.clients.find((user) => {
        return user.nome === nome;
      });
      const date = moment(this.date.value).format("YYYY-MM")
  
      if (user) {
        this.getClientValues(user.id, date)
      } else {
        console.log(`User with nome '${nome}' not found.`);
      }
    } else {
      const date = moment(this.date.value).format("YYYY-MM")
      this.getClientValues(this.idClienteLogado, date)
    }
  }

  private getAllClients() {
    this.homeService.getAllClients().subscribe({
      next: (response: object) => {
        const res = response as ReportUserData[]
        this.clients = res;
      },
      error: (error) => {
        console.log("Erro ao recuperar os clientes para o relatório: ", error);
      },
    });
  }

  private getClientValues(userId: number, date: string) {
    this.homeService.getClientValues(userId, date).subscribe({
        next: (response: object) => {
          const res = response as ReportClientData[]
          this.clientsValues = res
            if (this.clientsValues && this.clientsValues.length !== 0 ) {
                this.dialogService.openValuesDialog(this.clientsValues)
            } else {
                this.snack.openErrorSnack("Não foram encontrados valores para o período selecionado")
            }
        },
        error: (error) => {
            console.log("Erro ao recuperar os valores para o relatório: ", error)
        }
    })
  }
  
  private getClientData() {
    this.homeService.getClientData().subscribe({
      next: (response: object) => {
        const res = response as ReportUserData
        this.idClienteLogado = res.id
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
