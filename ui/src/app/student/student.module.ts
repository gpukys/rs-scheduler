import { NgModule } from '@angular/core';
import { MatModule } from '../mat.module';
import { NavBarModule } from '../navbar/navbar.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { SharedModule } from '../shared.module';
import { OverviewComponent } from './overview/overview.component';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student.routing.module';


@NgModule({
  imports: [SharedModule, MatModule, StudentRoutingModule,NavBarModule, SchedulerModule],
  exports: [],
  declarations: [StudentComponent, OverviewComponent],
  providers: [],
})
export class StudentModule { }
