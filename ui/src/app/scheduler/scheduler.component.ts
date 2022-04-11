import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { add, isAfter, isBefore, sub } from 'date-fns';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit {
  today = new Date();
  mockEvents: CalendarEvent[] = [
    {
      start: new Date(2022, 3, 11, 11, 20),
      end: new Date(2022, 3, 11, 13, 30),
      title: 'interview 1',
      meta: {
        some: 'meta'
      },
    },
    {
      start: new Date(2022, 3, 11, 12, 20),
      end: new Date(2022, 3, 11, 14, 30),
      title: 'interview 2',
      meta: {
        some: 'meta'
      },
    },
    {
      start: new Date(2022, 3, 11, 11, 40),
      end: new Date(2022, 3, 11, 15, 20),
      title: 'interview 2',
      meta: {
        some: 'meta'
      },
    }
  ]

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log(this.today)
    this.auth.fakePath().subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log('inner handle', err)
    })
  }

  previousWeek() {
    this.today = sub(this.today, {days: 7})
  }

  nextWeek() {
    this.today = add(this.today, {days: 7})
  }

  canSeePreviousWeek(): boolean {
    return isBefore(this.today, add(new Date(), {hours: 23, minutes: 59, seconds: 59}));
  }

  handleEventClick(event: any) {
    console.log(event);
  }

  handleSegmentClick(event: any) {
    this.mockEvents = [
      ...this.mockEvents,
      {
        start: event.date,
        end: add(event.date, {hours: 2}),
        title: 'Interview 4'
      }
    ]
  }
}
