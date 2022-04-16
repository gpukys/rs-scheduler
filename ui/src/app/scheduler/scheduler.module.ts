import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SchedulerComponent } from './scheduler.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CreateInterviewComponent } from './create-interview/create-interview.component';
import { MatModule } from '../mat.module';
import { SharedModule } from '../shared.module';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CancelComponent } from './cancel/cancel.component';


@NgModule({
  declarations: [
    SchedulerComponent,
    CreateInterviewComponent,
    DeletionConfirmationComponent,
    ConfirmationComponent,
    CancelComponent
  ],
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class SchedulerModule { }
