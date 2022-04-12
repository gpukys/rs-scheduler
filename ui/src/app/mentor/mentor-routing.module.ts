import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from '../scheduler/scheduler.component';
import { MentorComponent } from './mentor.component';
import { TesterComponent } from './tester/tester.component';

const routes: Routes = [
  { path: '', component: MentorComponent },
  { path: 'schedule', component: SchedulerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRoutingModule { }
