import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { add, format, formatISO, isAfter, isBefore, parseISO, sub } from 'date-fns';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SchedulerService } from '../scheduler.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: number, startDate: Date, endDate: Date},
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    private schedulerService: SchedulerService,
    private snackbar: SnackbarService,
    private fb: FormBuilder
  ) { }

  form: FormGroup;
  loading = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      startDate: [formatISO(this.data.startDate).slice(0,16), [Validators.required, notSoonerThan(this.data.startDate), notLaterThan(sub(this.data.endDate, {hours: 1}))]],
      endDate: {disabled: true, value: formatISO(add(this.data.startDate, {hours: 1})).slice(0,16)},
    })
    this.form.valueChanges.subscribe(res => {
      this.form.get('endDate')?.setValue(formatISO(add(new Date(this.form.get('startDate')?.value), {hours: 1})).slice(0,16), {emitEvent: false})
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  confirm() {
    this.loading = true;
    this.schedulerService.confirmInterview(this.data.id, {
      startDate: new Date(this.form.get('startDate')?.value).toISOString(),
      endDate: new Date(this.form.get('endDate')?.value).toISOString(),
    }).subscribe({
      next: () => {
        this.loading = false;
        this.snackbar.show('Interview accepted!');
        this.dialogRef.close(true);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error.message);
        this.loading = false;
      }
    })
  }

}

function notSoonerThan(target: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isBefore(new Date(control.value), target) ? {notSoonerThan: target} : null
  };
}

function notLaterThan(target: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return isAfter(new Date(control.value), target) ? {notLaterThan: target} : null
  };
}
