import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SchedulerService } from '../scheduler.service';

@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss']
})
export class CreateInterviewComponent {

  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {startDate: Date, endDate: Date},
    public dialogRef: MatDialogRef<CreateInterviewComponent>,
    private schedulerService: SchedulerService,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) {}

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.loading = true;
    this.authService.user$.pipe(take(1)).subscribe(user => {
      if (user) {
        const data = {
          student: user.discordID,
          startDate: this.data.startDate.toISOString(),
          endDate: this.data.endDate.toISOString(),
        };

        this.schedulerService.createInterview(data).subscribe({
          next: (res) => {
            this.loading = false;
            this.snackbar.show('Timeframe successfully created!');
            this.dialogRef.close(res);
          },
          error: (err: HttpErrorResponse) => {
            this.snackbar.show(err.error.message);
            this.loading = false;
          }
        })
      }
    })
  }
}
