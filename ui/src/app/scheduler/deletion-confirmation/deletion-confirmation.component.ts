import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SchedulerService } from '../scheduler.service';

@Component({
  selector: 'app-deletion-confirmation',
  templateUrl: './deletion-confirmation.component.html',
  styleUrls: ['./deletion-confirmation.component.scss']
})
export class DeletionConfirmationComponent {

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    public dialogRef: MatDialogRef<DeletionConfirmationComponent>,
    private schedulerService: SchedulerService,
    private snackbar: SnackbarService,
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.loading = true;
    this.schedulerService.deleteInterview(this.data.id).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackbar.show('Timeframe successfully deleted!');
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error.message);
        this.loading = false;
      }
    })
  }

}
