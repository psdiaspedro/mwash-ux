import { Component } from '@angular/core';
import { DialogService } from '../dialog.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    
    constructor(
        private dialogService: DialogService,
    ){}

    public onCreateEvent() {
        this.dialogService.openSchedulerDialog()
    }
}
