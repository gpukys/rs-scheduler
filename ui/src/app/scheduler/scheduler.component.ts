import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { add, intervalToDuration, isAfter, isBefore, isEqual, isThisQuarter, setHours, setMinutes, setSeconds, sub } from 'date-fns';
import { Subject, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { CancelComponent } from './cancel/cancel.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CreateInterviewComponent } from './create-interview/create-interview.component';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';
import { Interview, SchedulerService } from './scheduler.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit {
  today = new Date();
  events: CalendarEvent[] = [];
  isMentor = false;
  refresh = new Subject();
  readonly nextWorkingDayStart = 
  setSeconds(
    setMinutes(
      setHours(
        add(new Date(), {days: 1})
      , 8)
    , 0)
  , 0)

  constructor(
    private schedule: SchedulerService,
    private snackbar: SnackbarService,
    private auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllInterviews();
  }

  private getAllInterviews() {
    this.auth.isMentor().pipe(take(1)).subscribe(res => {
      this.isMentor = res;
      this.schedule.getAllInterviews().subscribe({
        next: (res) => {
          this.events = res.map(this.convertInterviewToCalendarEvent.bind(this))
          this.refresh.next(true)
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(err.error.message)
        }
      })
    })
  }

  previousWeek() {
    this.today = sub(this.today, {days: 7})
  }

  nextWeek() {
    this.today = add(this.today, {days: 7})
  }

  cantSeePreviousWeek(): boolean {
    return isBefore(this.today, add(new Date(), {hours: 23, minutes: 59, seconds: 59}));
  }

  cantSeeNextWeek(): boolean {
    return isAfter(add(this.today, {days: 7}), new Date('2022-04-29'));
  }

  handleEventClick(event: any) {
    console.log(event)
    if (this.isMentor) {
      let dialogRef;
      if (!event.event.title.includes('Possible')) {
        dialogRef = this.dialog.open(CancelComponent, {
          data: {id: event.event.id},
          width: '500px'
        });
      } else {
        dialogRef = this.dialog.open(ConfirmationComponent, {
          data: {id: event.event.id, startDate: event.event.start, endDate: event.event.end},
          width: '500px'
        });
      }
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.getAllInterviews();
        }
      })
    }
  }

  handleSegmentClick(event: {date: Date}) {
    if (!this.isMentor) {
      if (!this.startDateValidator(event.date)) {
        this.snackbar.show('Starting point cannot be in the past');
        return;
      }
      const dialogRef = this.dialog.open(CreateInterviewComponent, {
        data: {startDate: event.date, endDate: add(event.date, {minutes: 60})},
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.schedule.getInterviewById(res.id).subscribe(item => {
            this.events.push(this.convertInterviewToCalendarEvent(item));
            this.refresh.next(true)
          })
        }
      })
    }
  }

  validate(event: CalendarEventTimesChangedEvent) {
    return this.startDateValidator(event.newStart) && this.minimumDurationValidator(event.newStart, event.newEnd);
  }

  handleTimesChanged(event: CalendarEventTimesChangedEvent) {
    if (event.newEnd && event.event.end && event.event.id) {
      if (!isEqual(event.newStart, event.event.start) || !isEqual(event.newEnd, event.event.end)) {
        const {start, end} = event.event;
        const eventToEdit = this.events.find(e => e.id === event.event.id);
        if (eventToEdit) {
          eventToEdit.start = event.newStart,
          eventToEdit.end = event.newEnd
          this.refresh.next(true)
        }
        this.schedule.updateInterview({
          startDate: event.newStart.toISOString(),
          endDate: event.newEnd.toISOString(),
        }, Number(event.event.id)).subscribe({
          next: () => {},
          error: () => {
            if (eventToEdit) {
              eventToEdit.start = start,
              eventToEdit.end = end
              this.refresh.next(true)
            }
            this.snackbar.show('Failed to update the interview timeframe')
          }
        })
      }
    }
  }

  private convertInterviewToCalendarEvent(item: Interview): CalendarEvent {
    return {
      id: item.id,
      start: new Date(item.startDate),
      end: new Date(item.endDate),
      title: item.mentor ? `Interview ${item.student.username} - ${item.mentor.username}` : `Possible timeslot for ${item.student.username}`,
      color: {primary: item.student.color, secondary: item.student.color},
      resizable: {
        beforeStart: !this.isMentor,
        afterEnd: !this.isMentor,
      },
      cssClass: this.textColorBasedOnBg(item.student.color),
      actions: this.isMentor ? undefined : [
        {
          label: '<img class="icon" src="../../assets/trash-solid.svg"></img>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
              data: {id: event.id},
            });
            dialogRef.afterClosed().subscribe(res => {
              if (res) {
                this.events.splice(this.events.findIndex(e => e.id === event.id), 1)
                this.refresh.next(true)
              }
            })
          }
        },
      ]
    }
  }

  private startDateValidator(date: Date) {
    return isAfter(date, new Date()) || isEqual(date, new Date())
  }

  private minimumDurationValidator(start: Date, end: Date | undefined) {
    if (!end) {
      return false;
    }
    const duration = intervalToDuration({start, end}).hours;
    return !!duration && duration >= 1;
  }

  private textColorBasedOnBg(bgColor: string): string {
    const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      'dark' : 'light';
  }
}
