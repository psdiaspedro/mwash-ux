import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Property } from '../property';

import { default as _rollupMoment, Moment } from 'moment';
import { SnackService } from '../snack.service';
// import { AuthService } from 'src/app/auth.service';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';
import { UrlSerializer } from '@angular/router';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface User {
  id: any;
  nome: string;
}

interface UserValues {
    nome: string,
    diaAgendamento: string,
    logadouro: string,
    valor: number
}

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

  constructor(
    private snack: SnackService,
    // public auth: AuthService,
    public homeService: HomeService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  public displayFn(property: Property): string {
    return property ? property.enderecoCompleto : '';
  }

  clients: User[] = [];
  clientsValues: UserValues[] = [];
  dataString: string = ""

  date = new FormControl(moment());

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  public onGerarRelatorio() {
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
  }

  private getAllClients() {
    this.homeService.getAllClients().subscribe({
      next: (response: any) => {
        this.clients = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getClientValues(userId: number, date: string) {
    this.homeService.getClientValues(userId, date).subscribe({
        next: (response: any) => {
            this.clientsValues = response
            if (this.clientsValues && this.clientsValues.length !== 0 ) {
                console.log(this.clientsValues)
                //open dialog
            } else {
                this.snack.openErrorSnack("Não foram encontrados valores para o período selecionado")
            }
        },
        error: (error) => {
            console.log(error)
        }
    })
  }
}
