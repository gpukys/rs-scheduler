import { NgModule } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MentorRoutingModule } from './mentor-routing.module';
import { MentorComponent } from './mentor.component';
import { MentorNavBarModule } from './navbar/navbar.module';
import { TesterComponent } from './tester/tester.component';


@NgModule({
  imports: [MentorRoutingModule, MentorNavBarModule],
  exports: [],
  declarations: [MentorComponent, TesterComponent],
  providers: [AuthService],
})
export class MentorModule { }
