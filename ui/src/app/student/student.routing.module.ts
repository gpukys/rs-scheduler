import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerComponent } from '../scheduler/scheduler.component';
import { OverviewComponent } from './overview/overview.component';
import { StudentComponent } from './student.component';

const routes: Routes = [
  { path: '', component: StudentComponent, children: [
    { path: '', component: OverviewComponent },
    { path: 'schedule', component: SchedulerComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
