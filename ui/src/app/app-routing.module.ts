import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MentorGuard } from './guards/can-activate-mentor.guard';
import { StudentGuard } from './guards/can-activate-student.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'mentor',
    loadChildren: () => import('./mentor/mentor.module').then(m => m.MentorModule),
    canActivate: [MentorGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
    canActivate: [StudentGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
