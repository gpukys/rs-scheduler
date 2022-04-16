import { NgModule } from '@angular/core';
import { MatModule } from '../mat.module';
import { NavBarModule } from '../navbar/navbar.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { AuthService } from '../services/auth.service';
import { SharedModule } from '../shared.module';
import { MentorRoutingModule } from './mentor-routing.module';
import { MentorComponent } from './mentor.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  imports: [SharedModule, MatModule, MentorRoutingModule, NavBarModule, SchedulerModule],
  exports: [],
  declarations: [MentorComponent, OverviewComponent],
  providers: [AuthService],
})
export class MentorModule { }
