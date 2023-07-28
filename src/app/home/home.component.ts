import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public isAccountant = true

    constructor(
        private dialogService: DialogService,
        public auth: AuthService
    ) {
        
    }

    ngOnInit(): void {
        this.isAccountant = this.auth.hasReportAccess()
    }

    public onCreateEvent() {
        this.dialogService.openSchedulerDialog()
    }

    public onReport() {
        this.dialogService.openReportDialog()
    }
}
