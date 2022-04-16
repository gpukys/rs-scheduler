import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SchedulerService } from '../scheduler.service';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss']
})
export class CancelComponent {

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number},
    public dialogRef: MatDialogRef<CancelComponent>,
    private schedulerService: SchedulerService,
    private snackbar: SnackbarService,
  ) { }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.loading = true;
    this.schedulerService.cancelInterview(this.data.id).subscribe({
      next: () => {
        this.loading = false;
        this.snackbar.show('Interview cancelled!');
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error.message);
        this.loading = false;
      }
    })
  }

}
