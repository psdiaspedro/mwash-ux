import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-scheduling',
    templateUrl: './scheduling.component.html',
    styleUrls: ['./scheduling.component.scss']
})
export class SchedulingComponent {

    constructor(
        public dialogRef: MatDialogRef<SchedulingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    
}
