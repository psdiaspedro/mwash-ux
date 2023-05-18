import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { SnackService } from '../snack.service';
import { CompleteEventData } from 'src/interfaces/complete-event-data';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {

    constructor(
        public homeService: HomeService,
        private snack: SnackService,
        public dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: CompleteEventData
    ) {}

    onYes() {
        this.homeService.deleteEvent(this.data.agendamentoId).subscribe({
            next: () => {
                this.snack.openWarningSnack("Agendamento excluido com sucesso")
                this.dialogService.closeConfirmationDialog()
                this.dialogService.closeSchedulingDialog()
            },
            error: () => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
            }
        })
    }

    onNo() {
        console.log(this.data)
        this.snack.openWarningSnack("Nenhuma alteração foi feita")
        this.dialogService.closeConfirmationDialog()
        this.dialogService.closeSchedulingDialog()
    }
}
