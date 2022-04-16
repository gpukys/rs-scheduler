import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CurrentStatus, SchedulerService } from 'src/app/scheduler/scheduler.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  status: CurrentStatus;

  constructor(
    private scheduler: SchedulerService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.scheduler.getCurrentStatus().subscribe({
      next: (res) => {
        this.status = res;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error.message)
      }
    });
  }

}
