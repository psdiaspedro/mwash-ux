import { Component } from '@angular/core';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    constructor(
        private dialogService: DialogService
    ) {}

    public onCreateEvent() {
        this.dialogService.openSchedulerDialog()
    }

    public onReport() {
        this.dialogService.openReportDialog()
    }
}
