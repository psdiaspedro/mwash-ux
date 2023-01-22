import { Component, OnInit } from '@angular/core';
import { trackByHourSegment } from 'angular-calendar/modules/common/util/util';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

    constructor(
    ) {}

    ngOnInit(): void {

    }
}
