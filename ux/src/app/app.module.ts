import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { HomeModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DatePickerModule, TimePickerModule, DateRangePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';


registerLocaleData(ptBr)

@NgModule({
  declarations: [ //componentes, diretivas e pipes
    AppComponent
  ],
  imports: [ //outros modulos
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HomeModule,
    CalendarModule, DatePickerModule, TimePickerModule, DateRangePickerModule, DateTimePickerModule,
  ],
  providers: [ //services que vao ficar disponiveis para os declarations
    { provide: LOCALE_ID, useValue: 'pt' }
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
