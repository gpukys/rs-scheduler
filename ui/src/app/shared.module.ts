import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SchedulerModule } from './scheduler/scheduler.module';

@NgModule({
  imports: [],
  exports: [FlexLayoutModule, CommonModule, SchedulerModule],
  declarations: [],
  providers: [],
})
export class SharedModule { }
