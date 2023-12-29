import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { SnackService } from '../snack.service';
import { HomeService } from '../home.service';
import { DialogService } from '../dialog.service';
import { ReportUserData } from 'src/interfaces/report-user';
import { ReportClientData } from 'src/interfaces/client-report';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment, { Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/interfaces/my-formats';
import { Property } from "../../../interfaces/property";
import { MatDatepicker } from '@angular/material/datepicker';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-checklist-picker',
  templateUrl: './checklist-picker.component.html',
  styleUrls: ['./checklist-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ChecklistPickerComponent {

  constructor(
    private snack: SnackService,
    public homeService: HomeService,
    public dialogService: DialogService,
    public auth: AuthService
  ) {}

  public clients: ReportUserData[] = [];
  private clientsValues: ReportClientData[] = [];
  private idClienteLogado = 0;
  public  date = new FormControl(moment());
  public tomorrowEvents: CalendarEvent[] = []

  public reportForm = new FormGroup({
    diaAgendamento: new FormControl('', Validators.required),
  });

  public getAllEvents(day: string, month: string, year: number) {
    this.homeService.getAllEventsByDayAdmin(year, month, day)
            .subscribe( {
                next: (events: Array<CalendarEvent>) => {
                    this.tomorrowEvents = events
                },
                error: () => {
                    this.snack.openErrorSnack("Ocorreu um erro, tente novamente ou contate o TI")
                }
            })
  }


  public onGerarChecklist() {
    const date = moment(this.date.value)
    const year: number = date.year()
    const month = (date.month() + 1).toString().padStart(2, '0')
    const day = date.date().toString().padStart(2, '0')
    this.getAllEvents(day, month, year)
    setTimeout(() => {
      this.dialogService.openCheckListDialog(this.tomorrowEvents)
    }, 1000)
  }

}
