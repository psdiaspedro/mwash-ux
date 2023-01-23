import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../dialog.service';
import { HomeService } from '../home.service';
import { SnackService } from '../snack.service';

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
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onYes() {
        this.homeService.deleteEvent(this.data.agendamentoId).subscribe({
            next: (response) => {
                this.snack.openWarningSnack("Agendamento excluido com sucesso")
                this.dialogService.closeConfirmationDialog()
                this.dialogService.closeSchedulingDialog()
            },
            error: (error) => {
                this.snack.openErrorSnack("Ocorreu um erro, tente novamente")
            }
        })
    }

    onNo() {
        this.snack.openWarningSnack("Nenhuma alteração foi feita")
        this.dialogService.closeConfirmationDialog()
        this.dialogService.closeSchedulingDialog()
    }

    
}
